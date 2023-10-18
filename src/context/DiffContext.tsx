import React, { createContext, useContext, useState } from "react";
import { fileInfoWithDiff } from "../api/github/index";

const initialDiffData: fileInfoWithDiff[] = [];

const DiffContext = createContext<fileInfoWithDiff[] | undefined>(undefined);

export function useDiffContext(): fileInfoWithDiff[] {
  const context = useContext(DiffContext);
  if (context === undefined) {
    throw new Error("useDiffContext must be used within a DiffProvider");
  }
  return context;
}

export function DiffProvider({ children }: { children: React.ReactNode }) {
  const [diffData, setDiffData] = useState(initialDiffData);

  return (
    <DiffContext.Provider value={diffData}>{children}</DiffContext.Provider>
  );
}
