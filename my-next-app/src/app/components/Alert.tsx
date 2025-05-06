"use client"

import { useEffect } from "react";

interface AlertProps {
  message: string;
  onClose: () => void;
  msgType: "error" | "success";
}

const Alert: React.FC<AlertProps> = ({ message, onClose, msgType }) => {
  const alertStyles = msgType === "success" ? "bg-green-500" : "bg-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${alertStyles} text-white p-4 rounded-md`}>
      {message}
    </div>
  );
};

export default Alert;