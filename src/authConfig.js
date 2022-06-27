export const msalConfig = {
    auth: {
      // clientId: "1c4098b3-6b8b-4145-81dc-67e67f894301",
      // authority: "https://login.microsoftonline.com/common",
      // redirectUri: "http://localhost:3000/",
      clientId: process.env.REACT_APP_ADB2C_CLIENT_ID,
      authority: process.env.REACT_APP_ADB2C_AUTHORITY,
      knownAuthorities: process.env.REACT_APP_ADB2C_KNOWN_AUTHORITIES.split(','),
      redirectUri: process.env.REACT_APP_ADB2C_REDIRECT_URI,
      postLogoutRedirectUri: process.env.REACT_APP_ADB2C_POST_LOGOUT_REDIRECT_URI
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
  //  scopes: ["User.Read"]
  scopes: []
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };

  // Add here scopes for id token to be used at MS Identity Platform endpoints.
  // export const loginRequest = {
  //     scopes: process.env.REACT_APP_ADB2C_LOGIN_SCOPES.split(','),
  // };

  export const editProfile = {
    authority: process.env.REACT_APP_ADB2C_EDIT_PROFILE_AUTHORITY,
  };

  export const policyNames = {
    signUpSignIn: process.env.REACT_APP_ADB2C_SIGNUP_SIGNIN_POLICY
  };