import React, { useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ isOpen, onClose, content }) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      // className="absolute top-0 right-0 mt-2 w-48 p-3 border rounded shadow-lg bg-white"
      style={{ zIndex: 1000 }}
    >
      {content}
    </div>
  );
};

export default Popover;
