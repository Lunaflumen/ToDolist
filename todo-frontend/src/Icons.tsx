/** @jsxRuntime classic */
/** @jsx jsx */
import user from './images/user.svg';
import trash from './images/trash.svg';
import { css, jsx } from '@emotion/react';

export const UserIcon = () => (
   <img
      src={user}
      alt="User"
      width="12px"
      css={css`
         width: 12px;
         opacity: 0.6;
      `}
   />
);

export const TrashIcon = () => (
   <img
      src={trash}
      alt="User"
      width="20px"
      css={css`
         width: 20px;
         opacity: 0.6;
         z-index: 1;
      `}
   />
);
