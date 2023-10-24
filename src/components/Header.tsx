"use client";

import Link from "next/link";
import { useRepo } from "@/context/RepoContext";


export default function Header() {
  const { repo_url } = useRepo();
  var paths = repo_url.split("/");
  const repo_name = paths[paths.length - 1];
  
  return (
    <header className=" border-b-2 border-black">
      <nav className="navbar flex w-full items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          Code Review
        </Link>
        {repo_url ? (
          <div className="flex items-center gap-x-2">
            <span className=" text-lg">{repo_name}</span>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
