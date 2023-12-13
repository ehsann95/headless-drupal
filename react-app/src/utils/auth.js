export const userLogin = (config = {}) => {
  const defaultConfig = {
    base: process.env.REACT_APP_BASE_URL,
    token_name: "drupal-oauth-token",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: "consumer",
    expire_margin: 0,
  };
  config = { ...defaultConfig, ...config };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("client_id", "simple_secret");
    formData.append("client_secret", "simple_secret");
    // formData.append("scope", config.scope);
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

  const refreshToken = async (refresh_token) => {
    console.log("refresh");
    const formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refresh_token);
    formData.append("client_id", "simple_secret");
    formData.append("client_secret", "simple_secret");

    try {
      const response = await fetch(`${config.base}oauth/token`, {
        method: "post",
        headers: new Headers({
          Accept: "application/json",
        }),
        body: formData,
      });
      const data = await response.json();
      console.log(data);

      if (data.error) {
        console.log("Error retreiving refresh token", data);
        window.history.pushState({}, "", "/user/login");
        // return Promise.reject(`Error retrieving Refreshtoken: ${data.error}`);
        return;
      }

      return saveToken(data);
    } catch (error) {
      console.log("API got an Error", error);
      return Promise.reject(new Error(`API error: ${error}`));
    }
  };

  const token = () => {
    const token =
      localStorage.getItem(config.token_name) !== null
        ? JSON.parse(localStorage.getItem(config.token_name))
        : false;

    if (!token) {
      console.log("empty token. Please LogIn");
      return false;
    }

    const { expires_at, refresh_token } = token;
    if (expires_at - config.expire_margin < Date.now() / 1000) {
      return refreshToken(refresh_token);
    }
    return token;
  };

  const isLoggedIn = () => {
    const oauth_token = token();
    if (oauth_token) {
      // return Promise.resolve(true);
      return true;
    }

    console.log("Not logged In");
    return false;
  };

  return {
    login,
    logout,
    isLoggedIn,
    token,
    refreshToken,
  };
};
