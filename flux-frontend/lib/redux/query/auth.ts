import { createApi } from "@reduxjs/toolkit/query/react";
import { AuthResponse, AuthRequest } from "./types";
import baseFetch from "./base";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseFetch,
  endpoints: (builder) => ({
    auth: builder.mutation<AuthResponse, AuthRequest>({
      query: ({ email, password, path }) => ({
        url: `/auth/${path}`,
        body: {
          email,
          password,
        },
        method: "POST",
      }),
    }),
  }),
});

export const { useAuthMutation } = authApi;
