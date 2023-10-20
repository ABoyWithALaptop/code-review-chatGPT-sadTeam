"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getPulls, pull } from "@/api/github";

interface RepoContextType {
  selectedPR: pull;
  list_PR: pull[] | undefined;
  handleSelectPRContext: (pr: pull) => void;
  getListPRContext: () => void;
  loginContext: (url: string, token: string) => void;
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

  const getListPR = () => {
    useEffect(() => {
      getPulls(repo_url, repo_token).then((res) => setList_PR(res));
    }, [repo_url, repo_token]);
  };

  const login = (url: string, token: string) => {
    setRepo_url(url);
    setRepo_token(token);
  };

  const handleSelectPR = (pr: pull) => {
    setSelectedPull(pr);
    console.log(selectedPR)
  }

  const value = useMemo(
    () => ({
      list_PR,
      selectedPR,
      getListPRContext: getListPR,
      loginContext: login,
      handleSelectPRContext: handleSelectPR
    }),
    [list_PR, getListPR, login, handleSelectPR]
  );

  return <RepoContext.Provider value={value} {...props} />;
}
