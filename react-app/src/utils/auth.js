import axios from "axios";

const refreshPromises = [];

export const userLogin = (config = {}) => {
  const defaultConfig = {
    token_name: "drupal-oauth-token",
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    expire_margin: 0,
  };
  config = { ...defaultConfig, ...config };

  const login = async (username, password) => {
    try {
      const tokenData = await getOAuthToken(username, password);
      const restData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/login?_format=json`,
        {
          name: username,
          pass: password,
        }
      );

      localStorage.setItem("username", restData.data.current_user.name);

      return saveToken(tokenData);
    } catch (error) {
      console.log("API got an Error", error);
      return Promise.reject(new Error(`API error: ${error}`));
    }
  };

  const getOAuthToken = async (username, password) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("client_id", config.client_id);
    formData.append("client_secret", config.client_secret);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}oauth/token`,
        formData
      );
      const data = response.data;

      if (data.error) {
        console.log("Error retrieving token", data);
        return Promise.reject(
          new Error(`Error retrieving OAuth token: ${data.error}`)
        );
      }

      return data;
    } catch (error) {
      console.log("API got an Error", error);
      return Promise.reject(new Error(`API error: ${error}`));
    }
  };

  const saveToken = (data) => {
    let token = { ...data, date: Math.floor(Date.now() / 1000) };
    token.expires_at = token.date + token.expires_in;
    localStorage.setItem(config.token_name, JSON.stringify(token));
    return token;
  };

  const logout = () => {
    localStorage.removeItem(config.token_name);
    localStorage.removeItem("username");

    return Promise.resolve(true);
  };

  const fetchWithAuthentication = async (url, options) => {
    return axiosInstance(url, options);
  };

  const refreshToken = async (refresh_token) => {
    if (refreshPromises[refresh_token]) {
      return refreshPromises[refresh_token];
    }

    const formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refresh_token);
    formData.append("client_id", config.client_id);
    formData.append("client_secret", config.client_secret);

    return (refreshPromises[refresh_token] = axios
      .post(`${process.env.REACT_APP_BASE_URL}oauth/token`, formData)
      .then((response) => {
        delete refreshPromises[refresh_token];

        const data = response.data;
        if (data.error) {
          console.log("Error refreshing token", data);
          return false;
        }
        return saveToken(data);
      })
      .catch((err) => {
        delete refreshPromises[refresh_token];
        console.log("API got an error", err);
        // redirect to login
        window.location.href = "/user/logout";
        return Promise.reject(err);
      }));
  };

  const token = async () => {
    const token =
      localStorage.getItem(config.token_name) !== null
        ? JSON.parse(localStorage.getItem(config.token_name))
        : false;

    if (!token) {
      return Promise.reject("empty token");
    }

    const { expires_at, refresh_token } = token;
    if (expires_at - config.expire_margin < Date.now() / 1000) {
      return refreshToken(refresh_token);
    }

    return Promise.resolve(token);
  };

  const isLoggedIn = async () => {
    try {
      const oauthToken = await token();
      if (oauthToken) {
        return Promise.resolve(true);
      }
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.reject(false);
  };

  const debug = () => {
    const headers = {
      Accept: "application/vnd.api+json",
    };

    fetchWithAuthentication("/oauth/debug?_format=json", { headers })
      .then((response) => response.data)
      .then((data) => {
        console.log("debug", data);
      });
  };

  return {
    login,
    logout,
    isLoggedIn,
    token,
    refreshToken,
    fetchWithAuthentication,
    debug,
  };
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

// Request interceptor to attach the OAuth token to each request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = JSON.parse(localStorage.getItem("drupal-oauth-token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true;

      try {
        const refreshToken = JSON.parse(
          localStorage.getItem("drupal-oauth-token")
        ).refresh_token;
        const getToken = userLogin();
        const newToken = await getToken.refreshToken(refreshToken);
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken.access_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.log("Error refreshing token", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
