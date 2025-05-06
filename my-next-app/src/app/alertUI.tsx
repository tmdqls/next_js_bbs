"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import Alert from "@/app/components/Alert";
import { clearAlert } from "@/app/store/alertSlice";

const AlertUI = () => {
  const dispatch = useDispatch();
  const alertMessage = useSelector((state: RootState) => state.alert.msg);
  const alertType = useSelector((state: RootState) => state.alert.msgType);

  if (!alertMessage) return null;

  return (
    <Alert
      message={alertMessage}
      msgType={alertType as "success" | "error"}
      onClose={() => {
        dispatch(clearAlert());
      }}
    />
  );
};

export default AlertUI;
