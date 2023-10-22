"use client";

import React from "react";
import { CheckboxTree } from "../../components";
import CompareDiff from "@/components/CompareDiff";

const Page = () => {
	return (
		<div className="bg-gray-500">
			<h2 className="m-5 text-center text-xl font-semibold">
				Select files to review
			</h2>
			<div className="flex flex-row justify-around">
				<CheckboxTree />
				<div className="flex flex-col w-2/4">
					<CompareDiff />
					<div className="m-1 h-28 rounded-md border border-gray-500">
						ChatGPT Review specific file...
					</div>
					<div className="flex flex-row justify-around">
						<button className="btn-primary">Review</button>
						<button className="btn-primary">Sumary</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
