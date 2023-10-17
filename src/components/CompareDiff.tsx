import React from "react";

const CompareDiff = () => {
  return (
    <div className="flex flex-row">
      <div className="m-1 w-96 h-96 rounded border border-red-500">Old code based on patch</div>
      <div className="m-1 w-96 h-96 rounded border border-green-500">Changed based on patch</div>
    </div>
  );
};

export default CompareDiff;
