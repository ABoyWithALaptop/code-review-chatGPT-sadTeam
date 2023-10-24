"use client";

import { useSessionStorage } from "usehooks-ts";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getPulls, pull } from "@/services/github";

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

  const GetListPR = (repo_url: string, repo_token: string) => {
    useEffect(() => {
      getPulls(repo_url, repo_token).then((res) => setList_PR(res));
    }, [repo_url, repo_token]);
  };

  const login = (url: string, token: string) => {
    setRepo_url(url);
    setRepo_token(token);
  };

  const value = useMemo(
    () => ({
      list_PR,
      selectedPR,
      repo_url,
      repo_token,
      getListPRContext: GetListPR,
      loginContext: login,
      setSelectedPR: setSelectedPull,
    }),
    [list_PR, GetListPR, login, selectedPR]
  );

  return <RepoContext.Provider value={value} {...props} />;
}
