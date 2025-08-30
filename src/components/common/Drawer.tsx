import React, { ReactNode, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const drawerVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: "100%", opacity: 0 },
};

const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  const controls = useAnimation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      controls.start("open");
    } else {
      controls.start("closed");
    }
  }, [isOpen, controls]);

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onClose();
  };

  const handleCloseClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onClose();
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 40 }}
        />
      )}
      <motion.div
        ref={drawerRef}
        className="fixed right-0 top-0 w-[30rem] overflow-y-scroll h-full bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700"
        variants={drawerVariants}
        initial="closed"
        animate={controls}
        transition={{ type: "tween", duration: 0.3 }}
        style={{ zIndex: 50 }}
      >
        <button
          onClick={handleCloseClick}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full m-2 aspect-square w-10 h-10"
        >
          <i className="bi bi-x-lg"></i> 
        </button>
        <div className="p-4">{children}</div>
      </motion.div>
    </>
  );
};

export default Drawer;
