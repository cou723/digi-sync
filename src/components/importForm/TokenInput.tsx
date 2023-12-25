import React from "react";

import { useCustomSession } from "@/hooks/useCustomSession";

const TokenInput = () => {
	const { session, authStatus } = useCustomSession();
	return (
		<input
			name='accessToken'
			type='hidden'
			value={authStatus === "authenticated" ? session.accessToken : undefined}
		/>
	);
};

export default TokenInput;
