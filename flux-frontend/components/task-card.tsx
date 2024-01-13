"use client";

import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

import { MoreHorizontal, Trash } from "lucide-react";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDeleteTaskMutation } from "@/lib/redux/query";

type Props = {
  task: any;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export function TaskCard({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async () => {
    await deleteTask(task).unwrap();
  };

  return (
    <HoverCard>
      <Card {...draggableProps} {...dragHandleProps} ref={innerRef}>
        <section className="absolute right-8">
          <Popover>
            <PopoverTrigger>
              <MoreHorizontal size={20} />
            </PopoverTrigger>
            <PopoverContent className="w-28 flex items-center justify-center">
              <button
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 outline-none"
                aria-label="Deletar tarefa"
                onClick={handleDelete}
              >
                <span className="font-medium text-gray-700 mr-2">Deletar</span>
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            </PopoverContent>
          </Popover>
        </section>
        <CardHeader>
          <HoverCardTrigger>
            <CardDescription className="line-clamp-3">
              {task.title}
            </CardDescription>
          </HoverCardTrigger>
        </CardHeader>
      </Card>
      {task.description ? (
        <HoverCardContent>{task.description}</HoverCardContent>
      ) : null}
    </HoverCard>
  );
}
