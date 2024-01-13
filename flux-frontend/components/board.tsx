"use client";

import { useEffect, useState } from "react";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import { TaskCard } from "./task-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useFindAllTasksQuery, useUpdateTaskMutation } from "@/lib/redux/query";

export default function Board({ board_id }: { board_id: string }) {
  const [data, setData] = useState<any[] | []>([]);
  const { data: allTasks, isSuccess } = useFindAllTasksQuery({
    board_id,
  });
  const [updateTask] = useUpdateTaskMutation();

  const onDragEnd = async (result: DropResult) => {
    const { destination } = result;

    if (!destination) return;

    const newMap = new Map(data.map((item) => [item.id, { ...item }]));
    const movedItem = newMap.get(result.draggableId);

    if (movedItem) {
      movedItem.status = destination.droppableId;
      await updateTask(movedItem).unwrap();
      newMap.set(movedItem.id, movedItem);
    }

    const newDataArray = Array.from(newMap.values());
    setData(newDataArray);
  };

  useEffect(() => {
    if (isSuccess && allTasks) {
      setData(
        Array.from(new Map(allTasks.map((item) => [item.id, item])).values())
      );
    }
  }, [isSuccess, allTasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 my-20 mx-4 flex-col lg:flex-row">
        {["BACKLOG", "TODO", "INPROGRESS", "DONE", "CANCELED"].map(
          (status, index) => (
            <Droppable key={index} droppableId={status}>
              {(provided) => (
                <Card
                  className="overflow-hidden sm:w-full md:w-1/2 lg:w-1/4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <ScrollArea>
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        {status}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                      {data
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <TaskCard
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                task={task}
                                innerRef={provided.innerRef}
                              />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </CardContent>
                  </ScrollArea>
                </Card>
              )}
            </Droppable>
          )
        )}
      </div>
    </DragDropContext>
  );
}
