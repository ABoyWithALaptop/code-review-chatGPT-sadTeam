"use client";

import { useFileContext } from "@/context/SelectedFileContext";
import React from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/services/github";
import { useRepo } from "@/context/RepoContext";
import { toast } from "react-toastify";

const Summary = () => {
	const { selectedPR, repo_token } = useRepo();
	const { reply } = useFileContext();
	const router = useRouter();
	const comment = reply.reduce((acc, cur) => acc + cur.reply + "\n\n", "");
	console.log("comment");

	return (
		<div className="flex flex-col justify-center items-center bg-gray-500 h-full">
			<h2 className="m-5 text-center text-2xl font-semibold text-white">
				Summary review
			</h2>
			<div className="m-10 overflow-x-auto">
				{reply.map((review, index) => (
					<div key={index} className="text-white">
            <p className="mt-5 text-lg font-semibold">{review.file}</p>
						<p className="whitespace-pre-line">{review.reply}</p>
            <hr className="my-5 solid"/>
					</div>
				))}
			</div>
			<div className="flex flex-row gap-2">
				<button
					className="relative inline-block rounded-lg border border-gray-300 text-center text-sm font-bold text-[#51565B] bg-gray-200 hover:bg-gray-300 transition px-3 py-2 m-2 w-30"
					onClick={() => router.push("/select-pr")}
				>
					Go to home
				</button>
				<button
					className="relative inline-block rounded-lg border border-gray-300 text-center text-sm font-bold text-[#51565B] bg-gray-200 hover:bg-gray-300 transition px-3 py-2 m-2 w-30"
					onClick={() => {
						createComment(selectedPR, repo_token, comment).then(() => {
							toast.success("Commented on pull request");
						});
						router.push("/select-pr");
					}}
				>
					Comment this on pull request
				</button>
			</div>
		</div>
	);
};

export default Summary;
