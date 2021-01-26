import { useAuth0 } from '@auth0/auth0-react';
import { http } from './http';

export interface TaskData {
   taskId: number;
   title: string;
   content: string;
   // userName: string;
   createdAt: Date;
   isDone: boolean;
}

export interface TaskDataFromServer {
   taskId: number;
   title: string;
   content: string;
   // userName: string;
   createdAt: string;
   isDone: boolean;
}

export const mapTaskFromServer = (task: TaskDataFromServer): TaskData => ({
   ...task,
   createdAt: new Date(task.createdAt),
});

export const getScheduledTasks = async (): Promise<TaskData[]> => {
   return await getSomeTasks('/tasks/scheduled');
};

export const getReadyTasks = async (): Promise<TaskData[]> => {
   return await getSomeTasks('/tasks/ready');
};

export const getSomeTasks = async (path: string): Promise<TaskData[]> => {
   try {
      const result = await http<undefined, TaskDataFromServer[]>({ path });
      if (result.parsedBody) {
         return result.parsedBody.map(mapTaskFromServer);
      } else {
         return [];
      }
   } catch (ex) {
      console.error(ex);
      return [];
   }
};

export const getTask = async (taskId: number): Promise<TaskData | null> => {
   try {
      const result = await http<undefined, TaskDataFromServer>({
         path: `/tasks/${taskId}`,
      });
      if (result.ok && result.parsedBody) {
         return mapTaskFromServer(result.parsedBody);
      } else {
         return null;
      }
   } catch (ex) {
      console.error(ex);
      return null;
   }
};

export const finishTask = async (taskId: number): Promise<TaskData | null> => {
   try {
      const result = await http<object, undefined>({
         path: `/tasks/${taskId}`,
         method: 'put',
         body: { isDone: true },
      });
      return getTask(taskId);
   } catch (ex) {
      console.error(ex);
      return null;
   }
};

export const deleteTask = async (taskId: number) => {
   try {
      const result = await http<undefined, undefined>({
         path: `/tasks/${taskId}`,
         method: 'delete',
      });
      return;
   } catch (ex) {
      console.error(ex);
      return null;
   }
};

export const searchTasks = async (criteria: string): Promise<TaskData[]> => {
   try {
      const result = await http<undefined, TaskDataFromServer[]>({
         path: `/tasks?search=${criteria}`,
      });
      if (result.ok && result.parsedBody) {
         return result.parsedBody.map(mapTaskFromServer);
      } else {
         return [];
      }
   } catch (ex) {
      console.error(ex);
      return [];
   }
};

export interface AddTaskData {
   title: string;
   content: string;
   // userName: string;
   createdAt: Date;
}

export const addTask = async (
   task: AddTaskData
): Promise<TaskData | undefined> => {
   // const { getAccessTokenSilently } = useAuth0();
   // const accessToken = await getAccessTokenSilently();
   try {
      const result = await http<AddTaskData, TaskDataFromServer>({
         path: '/tasks',
         method: 'post',
         body: task,
         // accessToken,
      });
      if (result.ok && result.parsedBody) {
         return mapTaskFromServer(result.parsedBody);
      } else {
         return undefined;
      }
   } catch (ex) {
      console.error(ex);
      return undefined;
   }
};
