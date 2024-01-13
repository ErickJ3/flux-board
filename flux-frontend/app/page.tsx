"use client";
import { useEffect } from "react";
import nookies from "nookies";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderAuth from "@/components/header-auth";
import { useAuthMutation } from "@/lib/redux/query";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/redux/query/base";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [auth, { isLoading, isSuccess, data }] = useAuthMutation();
  const onSubmit = handleSubmit((data) =>
    auth({ ...(data as any), path: "sign-in" })
  );

  useEffect(() => {
    if (isSuccess && data) {
      nookies.set(null, ACCESS_TOKEN_COOKIE, data.access_token);
      nookies.set(null, REFRESH_TOKEN_COOKIE, data.refresh_token);
      router.push("/boards");
    }
  }, [isSuccess, router]);

  return (
    <main className="flex h-auto md:h-screen items-center justify-center p-4 md:p-24">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <HeaderAuth
          title="Welcome"
          description="Fill in the information below to create your account"
        />
        <div className="flex flex-col gap-3">
          <Input
            {...register("email")}
            type="email"
            placeholder="myemail@gmail.com"
            className="focus-visible:ring-transparent"
          />
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••"
            className="focus-visible:ring-transparent"
          />
          <Link href="/register" className="text-sm underline text-emerald-400">
            create account
          </Link>
        </div>

        <Button isLoading={isLoading} className="mt-4 w-full" type="submit">
          Entrar
        </Button>
      </form>
    </main>
  );
}
