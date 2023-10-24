"use client";

import React, { useEffect, useState } from "react";
import { CheckboxTree } from "../../components";
import CompareDiff from "@/components/CompareDiff";
import { useRepo } from "@/context/RepoContext";
import { getDiff } from "@/services/github";
import { Node } from "react-checkbox-tree";
import { useFileContext } from "@/context/SelectedFileContext";
import { review } from "@/services/GPT";
import { useRouter } from "next/navigation";
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
	const [fileReviewed, setFileReviewed] = useState<string[]>([]);
	const router = useRouter();
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
		setFilesReviewing(
			filesReviewing.filter((file) => !fileReviewed.includes(file))
		);
	}, [fileReviewed]);

	useEffect(() => {
		const filesTree: Node[] = [];
		totalFileCollection?.forEach((item) => {
			if (!item.newFile?.includes("/"))
				filesTree.push({ value: item.newFile!, label: item.newFile });
			else {
				let temp: Node;
				const fileSplit = item.newFile?.split("/");
				const exist1st = filesTree.filter((file) => {
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
		});
		setFilesTree(filesTree);
	}, [totalFileCollection]);

	useEffect(() => {
		if (reviewStatus === true) {
			setReviewText("file is reviewing...");
		} else {
			if (reply.some((item) => item.file === fileOnWatch.newFile)) {
				setReviewText(
					reply.filter((item) => item.file === fileOnWatch.newFile!)[0]?.reply!
				);
			} else {
				setReviewText("nothing to review");
			}
		}
	}, [reviewStatus, reply, fileOnWatch]);
	useEffect(() => {
		if (fileOnWatch) {
			const bool = filesReviewing.some((file) => file === fileOnWatch?.newFile);
			setReviewStatus(bool);
		}
	}, [fileOnWatch, filesReviewing]);

	const handleReview = () => {
		if (fileSelected.length == 0 && !fileOnWatch) {
			toast.error("Please select file to review");
			return;
		}
		setReviewStatus(true);
		const currentlyReviewing = totalFileCollection.filter((file) =>
			filesReviewing.includes(file.newFile!)
		);
		const reviewFiles =
			fileSelected.length > 0
				? fileSelected
				: [...currentlyReviewing, fileOnWatch];
		setFilesReviewing(reviewFiles.map((file) => file.newFile!));
		if (
			reply.some(
				(item) => filesReviewing.filter((file) => file === item.file).length > 0
			)
		) {
			// remove file in reply that is in reviewFiles
			const copyReply = [...reply];
			reviewFiles.forEach((file) => {
				const index = copyReply.findIndex((item) => item.file === file.newFile);
				if (index > -1) {
					copyReply.splice(index, 1);
				}
			});
			setReply(copyReply);
		}
		review(selectedPR, reviewFiles).then((res) => {
			toast.success(`reviewed`);
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
			setFileReviewed([
				...fileReviewed,
				...reviewFiles.map((file) => file.newFile!),
			]);
		});
	};

	const handleSummary = () => {
		if (fileSelected.length == 0 && !fileOnWatch) {
			toast.error("Please select file to review");
			return;
		}
		router.push("/summary");
		setFilesReviewing([]);
		const abort = new AbortController();
		abort.abort();
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
						<p className=" whitespace-pre-line overflow-auto">{reviewText}</p>
					</div>
					<div className="flex flex-row justify-around">
						<button
							className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
							onClick={handleReview}
							disabled={reviewStatus}
						>
							Review
						</button>
						<button
							className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
							onClick={handleSummary}
							disabled={reviewStatus}
						>
							Summary
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
