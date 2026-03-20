import { useEffect } from "react";
import { AppRouter } from "./router";

function App() {
  useEffect(() => {
    const activeTitle = "Co tam misiu?";
    const inactiveTitle = "Wróć do nas...";

    const handleVisibilityChange = () => {
      document.title = document.hidden ? inactiveTitle : activeTitle;
    };

    document.title = activeTitle;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <AppRouter />;
}

export default App;
