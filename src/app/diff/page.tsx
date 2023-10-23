"use client";

import React, { useEffect, useState } from "react";
import { CheckboxTree } from "../../components";
import CompareDiff from "@/components/CompareDiff";
import { useRepo } from "@/context/RepoContext";
import { getDiff } from "@/services/github";
import { Node } from "react-checkbox-tree";
import { useFileContext } from "@/context/SelectedFileContext";

function searchTree(element: Node, matchingTitle: string): Node | boolean {
	if (element.value === matchingTitle) return element;
	else if (element.children != null) {
		let i;
		let result: Node | boolean = false;
		for (i = 0; result === false && i < element.children.length; i++) {
			result = searchTree(element.children[i], matchingTitle);
		}
		return result;
	}
	return false;
}

const Page = () => {
	const { repo_token, selectedPR } = useRepo();
	const [diffText, setDiffText] = useState<string>("");
	const [filesTree, setFilesTree] = useState<Node[]>([]); //[{ value: "src", label: "src" }
	const { totalFileCollection, setTotalFileCollection } = useFileContext();
	useEffect(() => {
		getDiff(selectedPR.diff_url, repo_token).then((res) => {
			setTotalFileCollection(res!);
		});
	}, []);
	useEffect(() => {
		console.log("diff", totalFileCollection);
		const filesTree: Node[] = [];
		totalFileCollection?.forEach((item) => {
			if (!item.newFile?.includes("/"))
				filesTree.push({ value: item.newFile!, label: item.newFile });
			else {
				let temp: Node;
				const fileSplit = item.newFile?.split("/");
				console.log("fileSplit", fileSplit);
				const exist1st = filesTree.filter((file) => {
					console.log("file", file);
					return file.value === fileSplit[0];
				});
				if (exist1st.length > 0) {
					for (let i = 1; i < fileSplit.length; i++) {
						const element = searchTree(exist1st[0], fileSplit[i]);
						if (element) {
							temp = element as Node;
						} else {
							if (fileSplit[i].includes(".")) {
								temp = {
									value: fileSplit[i],
									label: fileSplit[i],
								};
							} else {
								temp = {
									value: fileSplit[i],
									label: fileSplit[i],
									children: [],
								};
							}
							const prev = searchTree(exist1st[0], fileSplit[i - 1]) as Node;
							prev.children?.push(temp);
						}
					}
				} else {
					let temp: Node = {
						value: fileSplit[0],
						label: fileSplit[0],
						children: [],
					};
					filesTree.push(temp);
					for (let i = 1; i < fileSplit.length; i++) {
						const element = searchTree(temp, fileSplit[i]);
						if (element) {
							temp = element as Node;
						} else {
							if (fileSplit[i].includes(".")) {
								temp = {
									value: item.newFile,
									label: fileSplit[i],
								};
							} else {
								temp = {
									value: fileSplit[i],
									label: fileSplit[i],
									children: [],
								};
							}
							const prev = searchTree(temp, fileSplit[i - 1]) as Node;
							prev.children?.push(temp);
						}
					}
				}
			}
			console.log("filesTree", filesTree);
		});
		setFilesTree(filesTree);
		// let lines = totalFileCollection![0].rawString.split("\n");
		// lines.splice(0, 2);
		// const newStr = lines.join("\n");
		// setDiffText(newStr);
	}, [totalFileCollection]);
	return (
		<div className="bg-gray-500">
			<h2 className="m-5 text-center text-xl font-semibold">
				Select files to review
			</h2>
			<div className="flex flex-row justify-around">
				<CheckboxTree filesTree={filesTree || []} />
				<div className="flex flex-col w-2/4">
					<CompareDiff diffText={diffText} />
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
