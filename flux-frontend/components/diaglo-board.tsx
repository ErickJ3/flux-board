"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/constants/icons";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { useCreateBoardMutation } from "@/lib/redux/query";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export default function DialogBoard() {
  const [open, setOpen] = useState(false);
  const [createBoard, { isLoading, isSuccess, data }] =
    useCreateBoardMutation();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = handleSubmit((data) => createBoard(data));

  useEffect(() => {
    if (isSuccess && data) {
      setOpen(false);
      reset();
    }
  }, [isSuccess, data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="bg-gray-200 p-5 ml-3 sm:ml-0 mt-3 md:mt-0 rounded-md cursor-pointer">
          <Icons.Plus size={34} color="rgb(5 150 10)" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crie um novo Board</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            {...register("title")}
            placeholder="My Board"
            className="focus-visible:ring-transparent"
          />
          <Input
            {...register("description")}
            placeholder="Board tarefas"
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
