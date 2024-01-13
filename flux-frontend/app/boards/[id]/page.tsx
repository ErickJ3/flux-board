"use client";
import HeaderBoard from "@/components/header-board";
import BoardStruct from "@/components/board";

export default function Board({ params }: { params: { id: string } }) {
  localStorage.setItem("active_board", params.id);
  return (
    <section className="container pt-6 md:py-10 space-y-5">
      <HeaderBoard />
      <BoardStruct board_id={params.id} />
    </section>
  );
}
