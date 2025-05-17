"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import Alert from "@/components/Alert";
import { clearAlert } from "@/store/slice/alertSlice";

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
