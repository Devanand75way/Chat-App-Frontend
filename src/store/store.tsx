import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../services/api";
import authReducer from "./reducers/authReducers";
import { UserListApi } from "../services/userList";
import { groupList } from "../services/groupList";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [UserListApi.reducerPath]: UserListApi.reducer,
    [groupList.reducerPath]: groupList.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(UserListApi.middleware)
      .concat(groupList.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
