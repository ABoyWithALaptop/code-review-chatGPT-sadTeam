"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { fileInfoWithDiff, pull } from "@/services/github";

export type fileSelectedContextType = {
	fileSelected: fileInfoWithDiff[];
	totalFileCollection: fileInfoWithDiff[];
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
	// const router = useRouter();

	// const getListPR = () => {
	// 	useEffect(() => {
	// 		getPulls(repo_url, repo_token).then((res) => setList_PR(res));
	// 	}, [repo_url, repo_token]);
	// };

	// const login = (url: string, token: string) => {
	// 	setRepo_url(url);
	// 	setRepo_token(token);
	// };

	// const handleSelectPR = (pr: pull) => {
	// 	setSelectedPull(pr);
	// 	console.log(selectedPR);
	// 	if (pr.diff_url && repo_token) {
	// 		getDiff(pr.diff_url, repo_token).then((diffData) => {
	// 			console.log(diffData);
	// 		});
	// 	}
	// 	router.push("/diff");
	// };

	const value = useMemo(
		() => ({
			fileSelected: fileSelected,
			setFileSelected: setFileSelected,
			totalFileCollection: totalFileCollection,
			setTotalFileCollection: setTotalFileCollection,
			// getListPRContext: getListPR,
			// loginContext: login,
			// handleSelectPRContext: handleSelectPR,
		}),
		[fileSelected, totalFileCollection]
	);

	return <FileSelectedContext.Provider value={value} {...props} />;
}
