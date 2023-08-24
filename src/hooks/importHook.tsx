import { useEffect } from "react";

import { ImportFormState } from "@/components/importForm";

export default function useBeforeUnload(appState:ImportFormState) {
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
