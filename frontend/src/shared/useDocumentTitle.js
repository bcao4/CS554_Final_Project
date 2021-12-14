import { useEffect } from "react";

const DEFAULT_TITLE = "CryptoTracker";

const useDocumentTitle = (title) => {
  // Call this function from inside a component with a title, to set that title and title is reset
  // to the default title when leaving the component, if the title value changes, document.title will update with it

  useEffect(() => {
    // update document.title every time title updates
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      // reset to defualt when leaving
      document.title = DEFAULT_TITLE;
    },
    []
  );
};

export default useDocumentTitle;
