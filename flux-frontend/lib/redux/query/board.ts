import { createApi } from "@reduxjs/toolkit/query/react";
import baseFetch from "./base";
import { BoardsAllResponse } from "./types";

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: baseFetch,
  tagTypes: ["board"],
  endpoints: (builder) => ({
    allBoards: builder.query<BoardsAllResponse[], void>({
      query: () => ({
        url: "/board",
        method: "GET",
      }),
      providesTags: ["board"],
    }),
    createBoard: builder.mutation<any, any>({
      query: (data) => ({
        url: "/board",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["board"],
    }),
  }),
});

export const { useAllBoardsQuery, useCreateBoardMutation } = boardApi;
