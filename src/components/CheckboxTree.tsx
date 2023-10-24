"use client";

import { useRepo } from "@/context/RepoContext";
import { useFileContext } from "@/context/SelectedFileContext";
import { fileInfoWithDiff, getDiff } from "@/services/github";
import React, { useEffect, useState } from "react";
import CheckboxTree, { Node } from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
	MdCheckBox,
	MdCheckBoxOutlineBlank,
	MdChevronRight,
	MdKeyboardArrowDown,
	MdAddBox,
	MdIndeterminateCheckBox,
	MdFolder,
	MdFolderOpen,
	MdInsertDriveFile,
} from "react-icons/md";

interface TreeNode {
	value: string;
	label: string;
	children?: TreeNode[];
}

function CustomCheckBoxTree({
	filesTree,
	disable,
}: {
	filesTree: Node[];
	disable: boolean;
}): JSX.Element {
	console.log("filesTree", filesTree);
	const [checked, setChecked] = useState<string[]>([]);
	const [expanded, setExpanded] = useState<string[]>([]);
	const { repo_token, selectedPR } = useRepo();
	const { totalFileCollection, setFileOnWatch, setFileSelected } =
		useFileContext();
	const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
	useEffect(() => {
		if (checked.length > 0) {
			let checkedFile: fileInfoWithDiff[] = [];
			totalFileCollection.forEach((file) => {
				if (checked.includes(file.newFile!)) {
					checkedFile.push(file);
				}
			});
			if (checkedFile.length > 0) {
				setFileSelected(checkedFile);
			}
		}
	}, [checked]);

	useEffect(() => {
		if (selectedPR && selectedPR.diff_url && repo_token) {
			getDiff(selectedPR.diff_url, repo_token).then((res) => {
				const rootNode: TreeNode = {
					value: "root",
					label: "Project Root",
					children: [],
				};

				res?.forEach((item) => {
					if (item.newFile) {
						const filePath = item.newFile.split("/");
						let currentNode = rootNode;

						for (const part of filePath) {
							let childNode = currentNode.children?.find(
								(c) => c.value === part
							);
							if (!childNode) {
								childNode = { value: part, label: part, children: [] };
								currentNode.children = currentNode.children || [];
								currentNode.children.push(childNode);
							}
							currentNode = childNode;
						}
					}
				});

				setTreeNodes([rootNode]);
			});
		}
	}, [selectedPR, repo_token]);

	const icons = {
		check: <MdCheckBox className="rct-icon rct-icon-check" />,
		uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
		halfCheck: (
			<MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
		),
		expandClose: <MdChevronRight className="rct-icon rct-icon-expand-close" />,
		expandOpen: (
			<MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
		),
		expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
		collapseAll: (
			<MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
		),
		parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
		parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
		leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />,
	};
	return (
		//@ts-ignore
		<CheckboxTree
			nodes={filesTree}
			checked={checked}
			expanded={expanded}
			onCheck={(checked) => setChecked(checked)}
			onExpand={(expanded) => setExpanded(expanded)}
			onClick={(target) => {
				if (target.value.includes(".")) {
					const watch = totalFileCollection.filter(
						(file) => file.newFile === target.value
					);
					setFileOnWatch(watch[0]);
				}
			}}
			icons={icons}
			disabled={disable}
		/>
	);
}

export default CustomCheckBoxTree;
