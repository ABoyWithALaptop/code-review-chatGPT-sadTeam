"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getDiff, getPulls, pull } from "@/services/github";
import { useRouter } from "next/navigation";

interface RepoContextType {
	selectedPR: pull;
	list_PR: pull[] | undefined;
	token: string;
	repo_url: string;
	setRepo_url: (url: string) => void;
	setToken: (token: string) => void;
	setListPR: (listPR: pull[]) => void;
	setSelectedPR: (selectedPR: pull) => void;
}

const RepoContext = createContext<RepoContextType | null>(null);

export const useRepo = () => {
	const currentContext = useContext(RepoContext);

	if (!currentContext) {
		throw new Error("Not found BookContext");
	}

	return currentContext;
};

export default function RepoProvider(props: any) {
	const [list_PR, setList_PR] = useState<pull[]>();
	const [repo_url, setRepo_url] = useState<string>("");
	const [repo_token, setRepo_token] = useState<string>("");
	const [selectedPR, setSelectedPull] = useState<pull>();
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
			list_PR,
			selectedPR,
			repo_url,
			token: repo_token,
			setToken: setRepo_token,
			setListPR: setList_PR,
			setSelectedPR: setSelectedPull,
			setRepo_url: setRepo_url,
			// getListPRContext: getListPR,
			// loginContext: login,
			// handleSelectPRContext: handleSelectPR,
		}),
		[list_PR, selectedPR, repo_token, repo_url]
	);

	return <RepoContext.Provider value={value} {...props} />;
}
