import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import nookies from "nookies";
import { Mutex } from "async-mutex";
import { env } from "@/constants/env";
import axios from "axios";
import router from "next/router";
import { getSub } from "@/utils/getSub";

const mutex = new Mutex();

let context: unknown;

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

function destroyTokens(context: any) {
  nookies.destroy(context, ACCESS_TOKEN_COOKIE);
  nookies.destroy(context, REFRESH_TOKEN_COOKIE);
  router.push("/");
}

async function refreshTokens(currentContext: any) {
  const cookies = nookies.get(currentContext);

  const accessToken = cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE];

  if (!refreshToken) {
    destroyTokens(currentContext);
    return null;
  }

  try {
    const response = await axios.post(
      `${env.API_URL}/auth/refresh-token/${getSub(accessToken)}`,
      {
        refresh_token: refreshToken,
      }
    );

    const { access_token, refresh_token } = response.data;

    if (access_token && refresh_token) {
      nookies.set(currentContext, ACCESS_TOKEN_COOKIE, access_token);
      nookies.set(currentContext, REFRESH_TOKEN_COOKIE, refresh_token);
      return { access_token, refresh_token };
    } else {
      destroyTokens(currentContext);
      return null;
    }
  } catch (error) {
    destroyTokens(currentContext);
    return null;
  }
}

const baseFetch: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: (headers, { extra: ctx }) => {
      const cookies = nookies.get(ctx as any);
      context = ctx;
      if (cookies[ACCESS_TOKEN_COOKIE] && cookies[REFRESH_TOKEN_COOKIE]) {
        headers.set("Authorization", `Bearer ${cookies[ACCESS_TOKEN_COOKIE]}`);
      }
      return headers;
    },
  })(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const tokens = await refreshTokens(context as any);
        if (tokens) {
          const refreshedArgs = {
            ...(args as any),
            headers: {
              authorization: `Bearer ${tokens.access_token}`,
            },
          };

          result = await fetchBaseQuery({ baseUrl: env.API_URL })(
            refreshedArgs as any,
            api,
            extraOptions
          );
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await fetchBaseQuery({ baseUrl: env.API_URL })(
        args,
        api,
        extraOptions
      );
    }
  }

  return result;
};

export default baseFetch;
