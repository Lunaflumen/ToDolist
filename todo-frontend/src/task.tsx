/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { gray2, gray3, PrimaryButton } from './styles';
import { finishTask, TaskData, deleteTask } from './tasks-data';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { TrashIcon } from './Icons';

interface Props {
   data: TaskData;
   showContent?: boolean;
}

export const Task: FC<Props> = ({ data, showContent = true }) => {
   const [task, setTask] = useState<TaskData | null>(data);

   const doFinishTask = async () => {
      await finishTask(data.taskId);
      setTask(null);
   };

   const doDeleteTask = async () => {
      await deleteTask(data.taskId);
      setTask(null);
   };

   if (!task) {
      return null;
   }
   return (
      <div
         css={css`
            padding: 10px 0px;
         `}
      >
         <div
            css={css`
               padding: 10px 0px;
               font-size: 19px;
            `}
         >
            <div
               css={css`
                  display: flex;
                  justify-content: space-between;
               `}
            >
               <Link
                  to={`tasks/${data.taskId}`}
                  css={css`
                     text-decoration: none;
                     color: ${gray2};
                  `}
               >
                  {data.title}
               </Link>
               {/* {isAuthenticated && ( */}
               {!data.isDone && (
                  <PrimaryButton
                     css={css`
                        height: 30px;
                        padding: 0px 5px;
                     `}
                     onClick={doFinishTask}
                  >
                     Done
                  </PrimaryButton>
               )}
               {/* )} */}
            </div>
         </div>
         {showContent && (
            <div
               css={css`
                  padding-bottom: 10px;
                  font-size: 15px;
                  color: ${gray2};
               `}
            >
               {data.content.length > 50
                  ? `${data.content.substring(0, 50)}...`
                  : data.content}
            </div>
         )}
         <div
            css={css`
               display: flex;
               justify-content: space-between;
            `}
         >
            <div
               css={css`
                  font-size: 12px;
                  font-style: italic;
                  color: ${gray3};
               `}
            >
               {`Added on
                ${data.createdAt.toLocaleDateString()} 
                ${data.createdAt.toLocaleTimeString()}`}
            </div>
            <PrimaryButton onClick={doDeleteTask}>
               <TrashIcon />
            </PrimaryButton>
         </div>
      </div>
   );
};
