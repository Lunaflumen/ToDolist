export const server = 'https://localhost:44328';

export const webAPIUrl = `${server}/api`;

export const authSettings = {
   domain: 'dev-yciao-pj.eu.auth0.com',
   client_id: '0vFv6JWpvSfyOWpgzMhEbkxiN4RSRX1w',
   redirect_uri: window.location.origin + '/signin-callback',
   scope: 'openid profile TASKAPI email',
   audience: 'https://localhost:44328',
};
