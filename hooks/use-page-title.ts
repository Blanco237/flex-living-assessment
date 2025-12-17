import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      const originalTitle = document.title;
      document.title = `${title} - FlexLiving`;

      return () => {
        document.title = originalTitle;
      };
    }
  }, [title]);
}
