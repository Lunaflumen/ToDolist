import React, { FC } from 'react';
import { useAuth } from './auth';
import { Page } from './page';
import { StatusText } from './styles';

type SigninAction = 'signin' | 'signin-callback';

interface Props {
   action: SigninAction;
}

export const SignInPage: FC<Props> = ({ action }) => {
   const { signIn } = useAuth();

   if (action === 'signin') {
      signIn();
   }

   return (
      <Page title="Sign In">
         <StatusText>Signing in ...</StatusText>
      </Page>
   );
};
