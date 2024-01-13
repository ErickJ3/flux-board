"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useCreateTaskMutation } from "@/lib/redux/query";
import { Input } from "./ui/input";

export function CreateTask() {
  const activeBoard = localStorage.getItem("active_board") as string;
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<any>();
  const [createTask, { isSuccess, data, isLoading }] = useCreateTaskMutation();
  const onSubmit = handleSubmit((data) =>
    createTask({
      ...data,
      board_id: activeBoard,
    })
  );

  useEffect(() => {
    if (isSuccess && data) {
      setOpen(false);
      reset();
    }
  }, [isSuccess, data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-3 py-2 text-xs sm:px-4 sm:py-2 flex sm:text-sm w-full sm:w-auto">
          Create new task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>
            Task will be created in backlog. You can move it from backlog to any
            column after creation.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            {...register("title")}
            placeholder="Create Login Screen"
            className="focus-visible:ring-transparent"
          />
          <Input
            {...register("description")}
            placeholder="Create login screen with material ui"
            className="focus-visible:ring-transparent"
          />
          <Button isLoading={isLoading} className="mt-4" type="submit">
            Criar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
