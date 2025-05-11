"use client";

import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}