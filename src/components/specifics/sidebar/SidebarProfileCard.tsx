"use client";

import React, { useState } from "react";
// import GenericSkeleton from "@/components/common/GenericSkeleton";
import SignOutButton from "@/components/SignOutButton";
// import Popover from "@/components/common/Popover";

const SidebarProfileCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  // if (!user) return <GenericSkeleton className="rounded h-full border" />;

  

  return (
    <div
      className="relative rounded border border-gray-400 shadow p-3 cursor-pointer hover:bg-gray-100"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* <p>{user.email}</p> */}
      <SignOutButton />
      <button className="absolute top-3 right-3 text-blue-500">⚙️</button>
      {/* <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={
          <div className="p-3 w-[10rem] flex justify-start text-sm absolute bottom-0 left-64 bg-white text-gray-700 rounded border border-gray-700 grid gap-3">
            <div>
              <p className="font-bold">Settings</p>
              <p></p>
            </div>
            <div className="border border-b-gray-400 w-full" />
            <SignOutButton />
          </div>
        }
      /> */}
    </div>
  );
};

export default SidebarProfileCard;
