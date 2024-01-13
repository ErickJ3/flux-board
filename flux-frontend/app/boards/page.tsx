"use client";
import DialogBoard from "@/components/diaglo-board";
import { useAllBoardsQuery } from "@/lib/redux/query";
import Link from "next/link";

export default function Boards() {
  const { data: allBoards, isLoading } = useAllBoardsQuery();

  return (
    <main>
      <div className="m-7">
        <h2 className="font-medium text-emerald-600 text-lg">Boards</h2>
        <div className="flex flex-row flex-wrap mt-2 items-center">
          {isLoading && (
            <div className="p-16 rounded-lg cursor-pointer">
              <div className="border-t-transparent border-solid animate-spin rounded-full border-emerald-400 border-4 h-12 w-12"></div>
            </div>
          )}
          {allBoards &&
            allBoards.map((board, idx) => (
              <Link
                href={`/boards/${board.id}`}
                className="bg-gray-200 p-8 m-2 rounded-lg cursor-pointer flex-grow
              md:flex-grow-0 md:p-8 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                key={idx}
              >
                <span className="font-bold">{board.title}</span>
              </Link>
            ))}
          <DialogBoard />
        </div>
      </div>
    </main>
  );
}
