"use client";

import { useFileContext } from "@/context/SelectedFileContext";
import React from "react";
import { useRouter } from "next/navigation";

const Summary = () => {
  const { reply } = useFileContext();
  const router = useRouter();

  console.log("reply in Summary page:", reply);

  return (
    <div className="flex flex-col justify-center items-center bg-gray-500">
      <h2 className="m-5 text-center text-xl font-semibold text-white">
        Summary review
      </h2>
      <div className="m-5">
        {reply.map((review, index) => (
          <div key={index} className="text-white">
            <p>{review.reply}</p>
          </div>
        ))}
      </div>
      <button
        className="btn-primary text-center"
        onClick={() => router.push("/")}
      >
        Go to home
      </button>
    </div>
  );
};

export default Summary;
