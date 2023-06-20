import { useEffect } from "react";

export default function useBeforeUnload(appState) {
    useEffect(() => {
        function handleBeforeUnload() {
            return "Are you sure you want to leave this page?";
        }

        if (appState === "connect portal") {
            window.onbeforeunload = handleBeforeUnload;
        } else {
            window.onbeforeunload = null;
        }

        return () => {
            window.onbeforeunload = null;
        };
    }, [appState]);
}
