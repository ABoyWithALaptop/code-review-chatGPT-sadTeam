"use client";

import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
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

const nodes = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "app",
        label: "app",
        children: [
          {
            value: "login",
            label: "login",
            children: [{ value: "login.tsx", label: "login.tsx" }],
          },
          {
            value: "page.tsx",
            label: "page.tsx",
          },
        ],
      },
      {
        value: "components",
        label: "components",
        children: [
          {
            value: "CheckboxTree.tsx",
            label: "CheckboxTree.tsx",
          },
          {
            value: "index.tsx",
            label: "index.tsx",
          },
        ],
      },
      {
        value: "README.md",
        label: "README.md",
      },
    ],
  },
];

function CustomCheckBoxTree(): JSX.Element {
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

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
      nodes={nodes}
      checked={checked}
      expanded={expanded}
      onCheck={(checked) => setChecked(checked)}
      onExpand={(expanded) => setExpanded(expanded)}
      icons={icons}
    />
  );
}

export default CustomCheckBoxTree;
