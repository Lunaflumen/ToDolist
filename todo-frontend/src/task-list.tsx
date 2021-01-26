/** @jsxRuntime classic */
/** @jsx jsx */
import { FC, memo } from 'react';
import { css, jsx } from '@emotion/react';
import { gray5, accent2 } from './styles';
import { TaskData } from './tasks-data';
import { Task } from './task';

interface Props {
   data: TaskData[];
   renderItem?: (item: TaskData) => JSX.Element;
}

export const TaskList: FC<Props> = ({ data, renderItem }) => {
   return (
      <ul
         css={css`
            list-style: none;
            margin: 10px 0 0 0;
            padding: 0px 20px;
            background-color: #fff;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            border-top: 3px solid ${accent2};
            box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
         `}
      >
         {data.map((task) => (
            <li
               key={task.taskId}
               css={css`
                  border-top: 1px solid ${gray5};
                  :first-of-type {
                     border-top: none;
                  }
               `}
            >
               <Task data={task} />
            </li>
         ))}
      </ul>
   );
};
