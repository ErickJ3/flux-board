"use client";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthMutation } from "@/lib/redux/query";
import { useForm } from "react-hook-form";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<any>();
  const [auth, { isLoading, isSuccess }] = useAuthMutation();
  const onSubmit = handleSubmit((data) =>
    auth({ ...(data as any), path: "sign-up" })
  );

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <main className="flex h-auto md:h-screen items-center justify-center p-4 md:p-24">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <HeaderAuth
          title="Welcome"
          description=" Fill in the information below to access your account"
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
          <Link href="/" className="text-sm">
            have an account?
            <span className="underline text-emerald-400 ml-1">sign-in</span>
          </Link>
        </div>

        <Button isLoading={isLoading} className="mt-4 w-full" type="submit">
          Register
        </Button>
      </form>
    </main>
  );
}
