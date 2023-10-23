"use client";

import React, { useEffect, useState } from "react";
import { CheckboxTree } from "../../components";
import CompareDiff from "@/components/CompareDiff";
import { useRepo } from "@/context/RepoContext";
import { getDiff } from "@/services/github";
import { Node } from "react-checkbox-tree";
import { useFileContext } from "@/context/SelectedFileContext";
import { review } from "@/services/GPT";
import { toast } from "react-toastify";

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
	const [filesTree, setFilesTree] = useState<Node[]>([]); //[{ value: "src", label: "src" }
	const [reviewStatus, setReviewStatus] = useState<boolean>(false);
	const [reviewText, setReviewText] = useState<string>("");
	const {
		totalFileCollection,
		setTotalFileCollection,
		fileSelected,
		fileOnWatch,
		filesReviewing,
		setFilesReviewing,
		reply,
		setReply,
	} = useFileContext();
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
							console.log(`temp at ${i} when existed root`, temp);
							const prev = searchTree(exist1st[0], fileSplit[i - 1]) as Node;
							prev.children?.push(temp);
						}
					}
				} else {
					const initRoot = fileSplit.reduceRight((acc, cur, index) => {
						if (index === fileSplit.length - 1)
							return { label: cur, value: item.newFile };
						return { label: cur, value: cur, children: [{ ...acc }] };
					}, {});
					filesTree.push(initRoot as Node);
				}
			}
			console.log("filesTree", filesTree);
		});
		setFilesTree(filesTree);
	}, [totalFileCollection]);

	useEffect(() => {
		if (fileOnWatch) {
			console.log("fileOnWatch", fileOnWatch);
			console.log("reply", reply);
			if (
				reply.length > 0 &&
				reply.some(
					(item) =>
						item.file.toLowerCase() == fileOnWatch.newFile?.toLowerCase()
				)
			) {
				console.log("set status after reply");
				setReviewStatus(false);
			} else {
				setReviewStatus(filesReviewing.includes(fileOnWatch.newFile!));
			}
		}
	}, [fileOnWatch]);

	useEffect(() => {
		if (reviewStatus === true) {
			setReviewText("file is reviewing...");
		} else {
			console.log("reply", reply);
			console.log("fileOnWatch", fileOnWatch);
			if (reply.some((item) => item.file === fileOnWatch.newFile)) {
				setReviewText(
					reply.filter((item) => item.file === fileOnWatch.newFile!)[0]?.reply!
				);
			} else {
				setReviewText("nothing to review");
			}
		}
	}, [reviewStatus, reply, fileOnWatch]);

	const handleReview = () => {
		if (fileSelected.length == 0 && !fileOnWatch) {
			toast.error("Please select file to review");
			return;
		}
		setReviewStatus(true);
		const reviewFiles = fileSelected.length > 0 ? fileSelected : [fileOnWatch];
		setFilesReviewing(reviewFiles.map((file) => file.newFile!) || []);
		console.log("before review", reviewFiles);
		// if (
		// 	reply.some(
		// 		(item) =>
		// 			reviewFiles.filter((file) => file.newFile === item.file).length > 0
		// 	)
		// ) {

		// }
		review(selectedPR, reviewFiles).then((res) => {
			console.log("review", res);
			if (reply.length > 0) {
				const copyReply = [...reply];
				// check if any element in reply is in res
				res!.forEach((item) => {
					const index = copyReply.findIndex(
						(reply) => reply.file === item.file
					);
					if (index > -1) {
						copyReply[index] = item;
					} else {
						copyReply.push(item);
					}
				});
				setReply(copyReply);
			} else {
				setReply(res!);
			}
			setReviewStatus(false);
		});
	};

	return (
		<div className="bg-white h-full px-4">
			<h2 className="p-5 text-center text-xl font-semibold">
				{fileOnWatch
					? `currently view: ${fileOnWatch.newFile}`
					: "Select files to review (please open a file before choosing more files)"}
			</h2>
			<div className="flex flex-row justify-around h-[calc(100%_-_4.25rem)]">
				<div className="w-1/4">
					<CheckboxTree
						filesTree={filesTree || []}
						disable={fileOnWatch ? false : true}
					/>
				</div>
				<div className="flex flex-col w-3/4 h-full gap-1">
					<div className="h-1/2 overflow-auto bg-gray-500 rounded-md border-2 border-gray-800">
						<CompareDiff />
					</div>
					<div className="h-1/2 rounded-md border-2 border-gray-800 overflow-auto">
						<p className=" whitespace-pre-line">{reviewText}</p>
					</div>
					<div className="flex flex-row justify-around">
						<button
							className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
							onClick={handleReview}
							disabled={reviewStatus}
						>
							Review
						</button>
						<button className="btn-primary">Sumary</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
