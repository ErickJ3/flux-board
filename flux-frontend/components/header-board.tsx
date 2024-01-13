import Link from "next/link";
import { CreateTask } from "./create-task";

export default function HeaderBoard() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container  flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-10">
          <Link href="/boards" className="flex items-center">
            <span className="inline-block font-bold sm:w-20 md:w-24">Flux</span>
          </Link>
        </div>
        <CreateTask />
      </div>
    </header>
  );
}
