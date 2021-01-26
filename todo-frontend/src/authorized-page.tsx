import { useAuth0 } from '@auth0/auth0-react';
import React, { FC, Fragment } from 'react';
import { Page } from './page';

export const AuthorizedPage: FC = ({ children }) => {
   const { isAuthenticated } = useAuth0();
   if (isAuthenticated) {
      return <Fragment>{children}</Fragment>;
   } else {
      return <Page title="You do not have access to this page" />;
   }
};
