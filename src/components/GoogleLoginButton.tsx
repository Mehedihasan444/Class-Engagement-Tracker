import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    // window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?redirect_uri=${window.location.origin}/auth/google/callback`;
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors"
    >
      <FcGoogle className="h-5 w-5 text-red-600" />
      <span className="text-gray-700 font-medium">Continue with Google</span>
    </button>
  );
} 