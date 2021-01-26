import thunk, { ThunkAction } from 'redux-thunk';
import {
   Action,
   ActionCreator,
   combineReducers,
   Dispatch,
   Reducer,
   Store,
   createStore,
   applyMiddleware,
} from 'redux';
import {
   addTask,
   AddTaskData,
   getTask,
   getScheduledTasks,
   TaskData,
} from './tasks-data';

interface TasksState {
   readonly loading: boolean;
   readonly scheduled: TaskData[] | null;
   readonly addedResult?: TaskData;
}

export interface AppState {
   readonly tasks: TasksState;
}

export interface GotScheduledTasksAction extends Action<'GotScheduledTasks'> {
   tasks: TaskData[];
}

export interface AddedTaskAction extends Action<'AddedTask'> {
   result: TaskData | undefined;
}

interface GettingScheduledTasksAction extends Action<'GettingScheduledTasks'> {}

const initialTaskState: TasksState = {
   loading: false,
   scheduled: null,
};

type TasksActions =
   | GettingScheduledTasksAction
   | GotScheduledTasksAction
   | AddedTaskAction;

export const getScheduledTasksActionCreator: ActionCreator<
   ThunkAction<Promise<void>, TaskData[], null, GotScheduledTasksAction>
> = () => {
   return async (dispatch: Dispatch) => {
      const gettingScheduledTasksAction: GettingScheduledTasksAction = {
         type: 'GettingScheduledTasks',
      };
      dispatch(gettingScheduledTasksAction);
      const tasks = await getScheduledTasks();
      const gotScheduledTasksAction: GotScheduledTasksAction = {
         tasks,
         type: 'GotScheduledTasks',
      };
      dispatch(gotScheduledTasksAction);
   };
};

export const addTaskActionCreator: ActionCreator<
   ThunkAction<Promise<void>, TaskData, AddTaskData, AddedTaskAction>
> = (task: AddTaskData) => {
   return async (dispatch: Dispatch) => {
      const result = await addTask(task);
      const addedTaskAction: AddedTaskAction = {
         type: 'AddedTask',
         result,
      };
      dispatch(addedTaskAction);
   };
};

export const clearAddedTaskActionCreator: ActionCreator<AddedTaskAction> = () => {
   const addedTaskAction: AddedTaskAction = {
      type: 'AddedTask',
      result: undefined,
   };
   return addedTaskAction;
};

const tasksReducer: Reducer<TasksState, TasksActions> = (
   state = initialTaskState,
   action
) => {
   switch (action.type) {
      case 'GettingScheduledTasks': {
         return {
            ...state,
            scheduled: null,
            loading: true,
         };
      }
      case 'GotScheduledTasks': {
         return {
            ...state,
            scheduled: action.tasks,
            loading: false,
         };
      }
      case 'AddedTask': {
         return {
            ...state,
            scheduled: action.result
               ? (state.scheduled || []).concat(action.result)
               : state.scheduled,
            addedResult: action.result,
         };
      }
      default:
         neverReached(action);
   }
   return state;
};

const neverReached = (never: never) => {};

const rootReducer = combineReducers<AppState>({
   tasks: tasksReducer,
});

export function configureStore(): Store<AppState> {
   const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
   return store;
}
