import clsx from "clsx";
import React from "react";

type GenericSkeletonProps = {
  className?: string;
};

const GenericSkeleton = ({ className }: GenericSkeletonProps) => {
  return (
    <>
      <div
        className={clsx(
          "h-full w-full animate-pulse bg-black bg-opacity-30 border-transparent",
          className
        )}
      ></div>
    </>
  );
};

export default GenericSkeleton;
