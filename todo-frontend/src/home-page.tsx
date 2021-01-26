/** @jsxRuntime classic */
/** @jsx jsx */
import { FC, useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { PrimaryButton } from './styles';
import { TaskList } from './task-list';
import {
   getReadyTasks,
   getScheduledTasks,
   mapTaskFromServer,
   TaskData,
} from './tasks-data';
import { Page } from './page';
import { PageTitle } from './page-title';
import { RouteComponentProps } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export const HomePage: FC<RouteComponentProps> = ({ history }) => {
   const [tasks, setTasks] = useState<TaskData[] | null>(null);
   const [tasksLoading, setTasksLoading] = useState(true);
   const [isReady, setIsReady] = useState(true);

   useEffect(() => {
      const doGetScheduledTasks = async () => {
         const scheduledTasks = await getScheduledTasks();
         setTasks(scheduledTasks);
         setTasksLoading(false);
         setIsReady(false);
      };
      doGetScheduledTasks();
   }, []);

   const handleAddTaskClick = () => {
      history.push('/addtask');
   };

   const doGetScheduledTasks = async () => {
      const scheduledTasks = await getScheduledTasks();
      const readyTasks = await getReadyTasks();
      setTasks(readyTasks);
      setTasks(scheduledTasks);
      setIsReady(false);
   };

   const doGetReadyTasks = async () => {
      const readyTasks = await getReadyTasks();
      const scheduledTasks = await getScheduledTasks();
      setTasks(scheduledTasks);
      setTasks(readyTasks);
      setIsReady(true);
   };

   // const { isAuthenticated } = useAuth0();

   return (
      <Page>
         <div
            css={css`
               display: flex;
               align-items: center;
               justify-content: space-between;
            `}
         >
            {isReady ? (
               <PageTitle>Finished Tasks</PageTitle>
            ) : (
               <PageTitle>Scheduled Tasks</PageTitle>
            )}
            <div
               css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
               `}
            >
               {isReady ? (
                  <PrimaryButton
                     css={css`
                        margin-right: 10px;
                     `}
                     onClick={doGetScheduledTasks}
                  >
                     Unfinished Tasks
                  </PrimaryButton>
               ) : (
                  <PrimaryButton
                     css={css`
                        margin-right: 10px;
                     `}
                     onClick={doGetReadyTasks}
                  >
                     Finished Tasks
                  </PrimaryButton>
               )}
               {/* {isAuthenticated && ( */}
               <PrimaryButton onClick={handleAddTaskClick}>
                  Add task
               </PrimaryButton>
            </div>
            {/* )} */}
         </div>
         {tasksLoading ? (
            <div
               css={css`
                  font-size: 16px;
                  font-style: italic;
               `}
            >
               Loading...
            </div>
         ) : (
            <TaskList data={tasks || []} />
         )}
      </Page>
   );
};

export default HomePage;
