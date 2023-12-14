import axios from "axios";

const refreshPromises = [];

export const userLogin = (config = {}) => {
  const defaultConfig = {
    base: process.env.REACT_APP_BASE_URL,
    token_name: "drupal-oauth-token",
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    scope: "consumer",
    expire_margin: 0,
  };
  config = { ...defaultConfig, ...config };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("client_id", config.client_id);
    formData.append("client_secret", config.client_secret);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${config.base}oauth/token`, {
        method: "post",
        headers: new Headers({
          Accept: "application/json",
        }),
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        console.log("Error retreiving token", data);
        return Promise.reject(
          new Error(`Error retrieving Oauth token: ${data.error}`)
        );
      }

      // REST API Login to fetch user info
      const restLogin = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/login?_format=json`,
        {
          name: username,
          pass: password,
        }
      );

      const restData = await restLogin.data;
      localStorage.setItem("username", restData.current_user.name);

      if (restData.error) {
        console.log("Error retreiving user Login details", restData);
        return Promise.reject(
          new Error(`Error retrieving User details: ${restData.error}`)
        );
      }

      return saveToken(data);
    } catch (error) {
      console.log("API got an Error", error);
      return Promise.reject(new Error(`API error: ${error}`));
    }
  };

  const saveToken = (data) => {
    let token = Object.assign({}, data);
    token.date = Math.floor(Date.now() / 1000);
    token.expires_at = token.date + token.expires_in;
    localStorage.setItem(config.token_name, JSON.stringify(token));
    return token;
  };

  const logout = () => {
    localStorage.removeItem(config.token_name);
    return Promise.resolve(true);
  };

  const fetchWithAuthentication = async (url, options) => {
    if (!options.headers.get("Authorization")) {
      try {
        const oauth_token = await token();
        if (oauth_token) {
          console.log("using token");
          options.headers.append(
            "Authorization",
            `Bearer ${oauth_token.access_token}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    return fetch(`${config.base}${url}`, options);
  };

  const refreshToken = async (refresh_token) => {
    console.log("getting refresh token", refreshPromises[refresh_token]);
    if (refreshPromises[refresh_token]) {
      return refreshPromises[refresh_token];
    }

    const formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refresh_token);
    formData.append("client_id", config.client_id);
    formData.append("client_secret", config.client_secret);

    return (refreshPromises[refresh_token] = fetch(
      `${config.base}oauth/token`,
      {
        method: "post",
        headers: new Headers({
          Accept: "application/json",
        }),
        body: formData,
      }
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        delete refreshPromises[refresh_token];

        if (data.error) {
          console.log("Error refreshing token", data);
          return false;
        }
        return saveToken(data);
      })
      .catch((err) => {
        delete refreshPromises[refresh_token];
        console.log("API got an error", err);
        return Promise.reject(err);
      }));
  };

  const token = async () => {
    const token =
      localStorage.getItem(config.token_name) !== null
        ? JSON.parse(localStorage.getItem(config.token_name))
        : false;

    if (!token) {
      console.log("empty token. Please LogIn");
      // return false;
      return Promise.reject("empty token");
    }

    const { expires_at, refresh_token } = token;
    if (expires_at - config.expire_margin < Date.now() / 1000) {
      return refreshToken(refresh_token);
    }
    // return token;
    return Promise.resolve(token);
  };

  const isLoggedIn = async () => {
    try {
      const oauth_token = await token();
      if (oauth_token) {
        return Promise.resolve(true);
      }
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.reject(false);
  };

  const debug = () => {
    const headers = new Headers({
      Accept: "application/vnd.api+json",
    });

    fetchWithAuthentication("/oauth/debug?_format=json", { headers })
      .then((response) => response.json())
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
