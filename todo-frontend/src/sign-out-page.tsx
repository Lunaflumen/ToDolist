import React, { FC } from 'react';
import { useAuth } from './auth';
import { Page } from './page';
import { StatusText } from './styles';

type SignoutAction = 'signout' | 'signout-callback';

interface Props {
   action: SignoutAction;
}

export const SignOutPage: FC<Props> = ({ action }) => {
   let message = 'Signing out...';

   const { signOut } = useAuth();

   switch (action) {
      case 'signout':
         signOut();
         break;
      case 'signout-callback':
         message = 'You successfully signed out!';
         break;
   }

   return (
      <Page title="Sign out">
         <StatusText>{message}</StatusText>
      </Page>
   );
};
