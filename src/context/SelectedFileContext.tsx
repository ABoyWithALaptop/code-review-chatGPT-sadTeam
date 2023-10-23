"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { fileInfoWithDiff, pull } from "@/services/github";
import { reviewReply } from "@/services/GPT";

export type fileSelectedContextType = {
	fileSelected: fileInfoWithDiff[];
	totalFileCollection: fileInfoWithDiff[];
	fileOnWatch: fileInfoWithDiff;
	reply: reviewReply[];
	filesReviewing: string[];
	setFilesReviewing: React.Dispatch<React.SetStateAction<string[]>>;
	setReply: React.Dispatch<React.SetStateAction<reviewReply[]>>;
	setFileOnWatch: React.Dispatch<React.SetStateAction<fileInfoWithDiff>>;
	setTotalFileCollection: React.Dispatch<
		React.SetStateAction<fileInfoWithDiff[]>
	>;
	setFileSelected: React.Dispatch<React.SetStateAction<fileInfoWithDiff[]>>;
};

const FileSelectedContext = createContext<fileSelectedContextType | null>(null);

export const useFileContext = () => {
	const currentContext = useContext(FileSelectedContext);

	if (!currentContext) {
		throw new Error("Not found BookContext");
	}

	return currentContext;
};

export default function FileContextProvider(props: any) {
	const [fileSelected, setFileSelected] = useState<fileInfoWithDiff[]>([]);
	const [totalFileCollection, setTotalFileCollection] = useState<
		fileInfoWithDiff[]
	>([]);
	const [fileOnWatch, setFileOnWatch] = useState<fileInfoWithDiff>();
	const [reply, setReply] = useState<reviewReply[]>([]);
	const [filesReviewing, setFilesReviewing] = useState<string[]>([]);

	const value = useMemo(
		() => ({
			fileSelected: fileSelected,
			setFileSelected: setFileSelected,
			totalFileCollection: totalFileCollection,
			setTotalFileCollection: setTotalFileCollection,
			fileOnWatch: fileOnWatch,
			setFileOnWatch: setFileOnWatch,
			reply: reply,
			setReply: setReply,
			filesReviewing: filesReviewing,
			setFilesReviewing: setFilesReviewing,
		}),
		[fileSelected, totalFileCollection, fileOnWatch, reply, filesReviewing]
	);

	return <FileSelectedContext.Provider value={value} {...props} />;
}
