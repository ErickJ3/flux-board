import { createApi } from "@reduxjs/toolkit/query/react";
import baseFetch from "./base";

type TaskRequest = {
  title: string;
  description: string;
  board_id: string;
};

type TaskUpdateRequest = {
  id: string;
  status: string;
};

type FindAllTasksRequest = {
  board_id: string;
};

export type TaskResponse = {
  id: string;
  title: string;
  description: string;
  status: string;
  board_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseFetch,
  tagTypes: ["task"],
  endpoints: (builder) => ({
    createTask: builder.mutation<TaskResponse, TaskRequest>({
      query: (data) => ({
        url: "/task",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["task"],
    }),
    findAllTasks: builder.query<TaskResponse[] | [], FindAllTasksRequest>({
      query: ({ board_id }) => ({
        url: `/task/${board_id}`,
        method: "GET",
      }),
      providesTags: ["task"],
    }),
    updateTask: builder.mutation<TaskResponse, TaskUpdateRequest>({
      query: (data) => ({
        url: `/task/${data.id}`,
        body: data,
        method: "PUT",
      }),
      invalidatesTags: ["task"],
    }),
    deleteTask: builder.mutation<void, any>({
      query: (data) => ({
        url: `/task/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useFindAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
