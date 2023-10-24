"use client";

import { useFileContext } from "@/context/SelectedFileContext";
import React from "react";
import { useRouter } from "next/navigation";

const Summary = () => {
  const { reply } = useFileContext();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center bg-gray-500">
      <h2 className="m-5 text-center text-2xl font-semibold text-white">
        Summary review
      </h2>
      <div className="m-10">
        {reply.map((review, index) => (
          <div key={index} className="text-white">
            <h3 className="mt-5 text-lg">Review {index + 1}:</h3>
            <p className="whitespace-pre-line">{review.reply}</p>
          </div>
        ))}
      </div>
      <button
        className="relative inline-block rounded-lg border border-gray-300 text-center text-sm font-bold text-[#51565B] bg-gray-200 hover:bg-gray-300 transition px-3 py-2 m-2 w-30"
        onClick={() => router.push("/")}
      >
        Go to home
      </button>
    </div>
  );
};

export default Summary;
