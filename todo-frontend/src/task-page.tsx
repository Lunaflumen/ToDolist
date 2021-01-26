/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Page } from './page';
import {
   getTask,
   TaskData,
   mapTaskFromServer,
   TaskDataFromServer,
   deleteTask,
   finishTask,
} from './tasks-data';
import { css, jsx } from '@emotion/react';
import { gray1, gray3, gray6, PrimaryButton } from './styles';
import {
   HubConnectionBuilder,
   HubConnectionState,
   HubConnection,
} from '@aspnet/signalr';
import { useAuth0 } from '@auth0/auth0-react';
import { TrashIcon } from './Icons';

interface RouteParams {
   taskId: string;
}
export const TaskPage: FC<RouteComponentProps<RouteParams>> = ({ match }) => {
   const [task, setTask] = useState<TaskData | null>(null);

   const setUpSignalRConnection = async (taskId: number) => {
      const connection = new HubConnectionBuilder()
         .withUrl('https://localhost:44328/taskshub')
         .withAutomaticReconnect()
         .build();

      connection.on('Message', (message: string) => {
         console.log('Message', message);
      });
      connection.on('ReceiveTask', (task: TaskDataFromServer) => {
         console.log('ReceiveTask', task);
         setTask(mapTaskFromServer(task));
      });

      try {
         await connection.start();
      } catch (err) {
         console.log(err);
      }

      if (connection.state === HubConnectionState.Connected) {
         connection.invoke('SubscribeTask', taskId).catch((err: Error) => {
            return console.error(err.toString());
         });
      }

      return connection;
   };

   const cleanUpSignalRConnection = async (
      taskId: number,
      connection: HubConnection
   ) => {
      if (connection.state === HubConnectionState.Connected) {
         connection;
         try {
            await connection.invoke('UnsubscribeTask', taskId);
         } catch (err) {
            return console.error(err.toString());
         }
         connection.off('Message');
         connection.off('ReceiveTask');
         connection.stop();
      } else {
         connection.off('Message');
         connection.off('ReceiveTask');
         connection.stop();
      }
   };

   useEffect(() => {
      const doGetTask = async (taskId: number) => {
         const foundTask = await getTask(taskId);
         setTask(foundTask);
      };

      let connection: HubConnection;
      if (match.params.taskId) {
         const taskId = Number(match.params.taskId);
         doGetTask(taskId);
         setUpSignalRConnection(taskId).then((con) => {
            connection = con;
         });
      }

      return function cleanUp() {
         if (match.params.taskId) {
            const taskId = Number(match.params.taskId);
            cleanUpSignalRConnection(taskId, connection);
         }
      };
   }, [match.params.taskId]);

   const doFinishTask = async () => {
      const finishedTask = await finishTask(Number(match.params.taskId));
      setTask(null);
   };

   const doDeleteTask = async () => {
      await deleteTask(Number(match.params.taskId));
      setTask(null);
   };

   // const { isAuthenticated } = useAuth0();
   if (!task) {
      return null;
   }
   return (
      <Page>
         <div
            css={css`
               background-color: white;
               padding: 15px 20px 20px 20px;
               border-radius: 4px;
               border: 1px solid ${gray6};
               box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
            `}
         >
            <div
               css={css`
                  display: flex;
                  justify-content: space-between;
               `}
            >
               <div
                  css={css`
                     font-size: 19px;
                     font-weight: bold;
                     margin: 10px 0px 5px;
                  `}
               >
                  {task === null ? '' : task.title}
               </div>
               {/* {isAuthenticated && ( */}
               {!task?.isDone && (
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
            <Fragment>
               <p
                  css={css`
                     margin-top: 0px;
                     background-color: white;
                  `}
               >
                  {task.content}
               </p>
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
                     ${task.createdAt.toLocaleDateString()}
                     ${task.createdAt.toLocaleTimeString()}`}
                  </div>
                  <PrimaryButton onClick={doDeleteTask}>
                     <TrashIcon />
                  </PrimaryButton>
               </div>
            </Fragment>
         </div>
      </Page>
   );
};
