import type { Settings } from "@/types";

import { useRouter } from "next/router";
import { settingsData } from "./static/settings";

export const useSettings = () => {
  return {
    settings: settingsData.options,
  };
};
