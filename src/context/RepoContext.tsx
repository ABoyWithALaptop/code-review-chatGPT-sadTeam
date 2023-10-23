"use client";

import { useSessionStorage } from "usehooks-ts";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getDiff, getPulls, pull } from "@/services/github";
import { useRouter } from "next/navigation";

interface RepoContextType {
  selectedPR: pull;
  repo_url: string;
  repo_token: string;
  list_PR: pull[] | undefined;
  handleSelectPRContext: (pr: pull) => void;
  getListPRContext: (repo_url: string, repo_token: string) => void;
  loginContext: (url: string, token: string) => void;
  setSelectedPR: (selectedPR: pull) => void;
}

const RepoContext = createContext<RepoContextType | null>(null);

export const useRepo = () => {
  const currentContext = useContext(RepoContext);

  if (!currentContext) {
    throw new Error("Not found RepoContext");
  }

  return currentContext;
};

export default function RepoProvider(props: any) {
  const [list_PR, setList_PR] = useState<pull[]>();
  const [repo_url, setRepo_url] = useSessionStorage<string>("url", "");
  const [repo_token, setRepo_token] = useSessionStorage<string>("token", "");
  const [selectedPR, setSelectedPull] = useState<pull>();
  const router = useRouter();

  const GetListPR = (repo_url: string, repo_token: string) => {
    useEffect(() => {
      getPulls(repo_url, repo_token).then((res) => setList_PR(res));
    }, [repo_url, repo_token]);
  };

  const login = (url: string, token: string) => {
    setRepo_url(url);
    setRepo_token(token);
  };

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
      repo_token,
      getListPRContext: GetListPR,
      loginContext: login,
      // handleSelectPRContext: handleSelectPR,
      setSelectedPR: setSelectedPull,
    }),
    [list_PR, GetListPR, login, selectedPR]
  );

  return <RepoContext.Provider value={value} {...props} />;
}
