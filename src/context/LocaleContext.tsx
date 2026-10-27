"use client";

import React, { createContext, useContext, useMemo } from "react";
import { WeddingLocaleDictionary } from "@/types/locale";
import { viLocale } from "@/data/locales/vi";

export type LocaleType = "vi" | "jp";

interface LocaleContextValue {
  locale: LocaleType;
  dict: WeddingLocaleDictionary;
  setLocale?: (locale: LocaleType) => void;
}

const defaultContextValue: LocaleContextValue = {
  locale: "vi",
  dict: viLocale,
};

const LocaleContext = createContext<LocaleContextValue>(defaultContextValue);

interface LocaleProviderProps {
  locale: LocaleType;
  dict: WeddingLocaleDictionary;
  setLocale?: (locale: LocaleType) => void;
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  locale,
  dict,
  setLocale,
  children,
}) => {
  const value = useMemo(
    () => ({
      locale,
      dict,
      setLocale,
    }),
    [locale, dict, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
