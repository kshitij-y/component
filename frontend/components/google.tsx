import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleAuth() {
    const { signinWithGoogle } = useAuth();
    const handleLoginSuccess = async (credentialResponse: any) => {
      const token = credentialResponse.credential;

      const decoded: any = jwtDecode(token);
      console.log("Decoded:", decoded);

      await signinWithGoogle(token);
    };

    return (
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    );
}