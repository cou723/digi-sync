import { useState } from 'react';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { Button } from '@mui/material';


export default function CodeFlow() {
  const [codeResponse, setCodeResponse] = useState<CodeResponse | null>();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      setCodeResponse(codeResponse);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
      <Button onClick={() => googleLogin()}>
        Login with Google 🚀
      </Button>
  );
}
