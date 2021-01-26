/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC, useEffect, useState } from 'react';
import { Page } from './page';
import { css, jsx } from '@emotion/react';
import { RouteComponentProps } from 'react-router-dom';
import { searchTasks, TaskData } from './tasks-data';
import { TaskList } from './task-list';

export const SearchPage: FC<RouteComponentProps> = ({ location }) => {
   const [tasks, setTasks] = useState<TaskData[]>([]);

   const searchParams = new URLSearchParams(location.search);
   const search = searchParams.get('criteria') || '';

   useEffect(() => {
      const doSearch = async (criteria: string) => {
         const foundResults = await searchTasks(criteria);
         setTasks(foundResults);
      };
      doSearch(search);
   }, [search]);

   return (
      <Page title="Search Results">
         {search && (
            <p
               css={css`
                  font-size: 16px;
                  font-style: italic;
                  margin-top: 0px;
               `}
            >
               for "{search}"
            </p>
         )}
         <TaskList data={tasks} />
      </Page>
   );
};
