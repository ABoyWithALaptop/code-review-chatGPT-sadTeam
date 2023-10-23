import { useRepo } from "@/context/RepoContext";
import { useFileContext } from "@/context/SelectedFileContext";
import { getDiff } from "@/services/github";
import React, { useEffect, useState } from "react";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import "react-diff-view/style/index.css";

const CompareDiff = () => {
	const { fileOnWatch } = useFileContext();
	const [diffText, setDiffText] = useState<string>("");
	useEffect(() => {
		if (fileOnWatch) {
			let lines = fileOnWatch.rawString.split("\n");
			lines.splice(0, 2);
			const newStr = lines.join("\n");
			setDiffText(newStr);
		}
	}, [fileOnWatch]);
	const [diff] = parseDiff(diffText, { nearbySequences: "zip" });
	console.log("diff arr", diff);
	const EMPTY_HUNKS: any = [];
	return (
		<div className="flex flex-row text-black">
			{/* <div className="m-1 w-96 h-96 rounded border border-red-500">
				Old code based on patch
			</div>
			<div className="m-1 w-96 h-96 rounded border border-green-500">
				Changed based on patch
			</div> */}
			<div>
				<Diff
					viewType="split"
					diffType={diff.type}
					hunks={diff.hunks || EMPTY_HUNKS}
					optimizeSelection={true}
				>
					{(hunks) =>
						hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
					}
				</Diff>
			</div>
		</div>
	);
};

export default CompareDiff;
