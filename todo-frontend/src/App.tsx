/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Suspense } from 'react';
import HomePage from './home-page';
import { css, jsx } from '@emotion/react';
import { fontFamily, fontSize, gray2 } from './styles';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { SearchPage } from './search-page';
import { NotFoundPage } from './not-found-page';
import { TaskPage } from './task-page';
import { HeaderWithRouter as Header } from './header';
import { Auth0Provider } from '@auth0/auth0-react';
import { AddTaskPage } from './add-task-page';
import { AuthorizedPage } from './authorized-page';

const App: React.FC = () => {
   return (
      // <Auth0Provider
      //    domain="dev-yciao-pj.eu.auth0.com"
      //    clientId="0vFv6JWpvSfyOWpgzMhEbkxiN4RSRX1w"
      //    redirectUri={window.location.origin}
      //    audience="https://dev-yciao-pj.eu.auth0.com/api/v2/"
      //    scope="read:current_user update:current_user_metadata"
      // >
      <BrowserRouter>
         <div
            css={css`
               font-family: ${fontFamily};
               font-size: ${fontSize};
               color: ${gray2};
            `}
         >
            <Header />
            <Switch>
               <Redirect from="/home" to="/" />
               <Route exact path="/" component={HomePage} />
               <Route path="/search" component={SearchPage} />
               <Route path="/addtask">
                  <Suspense
                     fallback={
                        <div
                           css={css`
                              margin-top: 10px;
                              text-align: center;
                           `}
                        >
                           Loading...
                        </div>
                     }
                  >
                     {/* <AuthorizedPage> */}
                     <AddTaskPage />
                     {/* </AuthorizedPage> */}
                  </Suspense>
               </Route>
               {/* <Route
                     path="/signin"
                     render={() => <SignInPage action="signin" />}
                  />
                  <Route
                     path="/signin-callback"
                     render={() => <SignInPage action="signin-callback" />}
                  />
                  <Route
                     path="/signout"
                     render={() => <SignOutPage action="signout" />}
                  />
                  <Route
                     path="signout-callback"
                     render={() => <SignOutPage action="signout-callback" />}
                  /> */}
               <Route path="/tasks/:taskId" component={TaskPage} />
               <Route component={NotFoundPage} />
            </Switch>
         </div>
      </BrowserRouter>
      // </Auth0Provider>
   );
};

export default App;
