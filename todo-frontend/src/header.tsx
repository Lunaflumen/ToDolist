/** @jsxRuntime classic */
/** @jsx jsx */
import { UserIcon } from './Icons';
import { css, jsx } from '@emotion/react';
import {
   fontFamily,
   fontSize,
   gray1,
   gray2,
   gray5,
   PrimaryButton,
} from './styles';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export const Header: FC<RouteComponentProps> = ({ history, location }) => {
   const searchParams = new URLSearchParams(location.search);
   const criteria = searchParams.get('criteria') || '';

   const [search, setSearch] = useState(criteria);

   const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value);
   };

   const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      history.push(`/search?criteria=${search}`);
   };

   // const {
   //    loginWithRedirect,
   //    user,
   //    isAuthenticated,
   //    isLoading,
   //    logout,
   // } = useAuth0();

   return (
      <div
         css={css`
            position: fixed;
            box-sizing: border-box;
            top: 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            background-color: #fff;
            border-bottom: 1px solid ${gray5};
            box-shadow: 0 3px 7px 0 rgba(110, 112, 114, 0.21);
            z-index: 2;
         `}
      >
         <Link
            to="/"
            href="./"
            css={css`
               font-size: 24px;
               font-weight: bold;
               color: ${gray1};
               text-decoration: none;
            `}
         >
            TODO
         </Link>
         <form onSubmit={handleSearchSubmit}>
            <input
               type="text"
               placeholder="Search..."
               value={search}
               onChange={handleSearchInputChange}
               css={css`
                  box-sizing: border-box;
                  font-family: ${fontFamily};
                  font-size: ${fontSize};
                  padding: 8px 10px;
                  border: 1px solid ${gray5};
                  border-radius: 3px;
                  color: ${gray2};
                  background-color: white;
                  width: 100%;
                  height: 30px;
                  display: inline-block;
                  white-space: normal;
                  vertical-align: middle;
                  text-align: left;
                  :focus {
                     outline-color: ${gray5};
                  }
               `}
            />
         </form>
         {/* {!isLoading && isAuthenticated ? (
            <div
               css={css`
                  display: flex;
                  height: 45px;
               `}
            >
               <div
                  css={css`
                     display: table;
                     margin-right: 10px;
                  `}
               >
                  <h2
                     css={css`
                        margin-bottom: 10px;
                        margin-top: 0px;
                        height: 18px;
                     `}
                  >
                     {user.name}
                  </h2>
                  <p
                     css={css`
                        margin: 4px;
                     `}
                  >
                     {user.email}
                  </p>
               </div>
               <img
                  css={css`
                     border-radius: 10px;
                     height: 50px;
                  `}
                  src={user.picture}
                  alt={user.name}
               />
               <PrimaryButton
                  css={css`
                     font-family: ${fontFamily};
                     font-size: ${fontSize};
                     margin-left: 20px;
                     margin-top: 5px;
                     height: 40px;
                     padding: 5px 10px;
                     border: none;
                     background-color: transparent;
                     color: ${gray2};
                     text-decoration: none;
                     cursor: pointer;
                     span {
                        margin-left: 10px;
                     }
                     :focus {
                        outline-color: ${gray5};
                     }
                  `}
                  onClick={() => logout({ returnTo: window.location.origin })}
               >
                  <UserIcon />
                  <span>Log Out</span>
               </PrimaryButton>
            </div>
         ) : (
            <PrimaryButton
               css={css`
                  font-family: ${fontFamily};
                  font-size: ${fontSize};
                  padding: 5px 10px;
                  background-color: transparent;
                  color: ${gray2};
                  text-decoration: none;
                  border: none;
                  cursor: pointer;
                  span {
                     margin-left: 10px;
                  }
                  :focus {
                     outline-color: ${gray5};
                  }
               `}
               onClick={() => loginWithRedirect()}
            >
               <UserIcon />
               <span>Sign In</span>
            </PrimaryButton>
         )} */}
      </div>
   );
};

export const HeaderWithRouter = withRouter(Header);
