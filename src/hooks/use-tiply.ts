"use client";

import { useContext } from "react";

import { TiplyContext, type TiplyStore } from "@/providers/tiply-provider";

export function useTiply(): TiplyStore {
  const store = useContext(TiplyContext);
  if (!store) {
    throw new Error("useTiply must be used inside <TiplyProvider>");
  }
  return store;
}
