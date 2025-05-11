import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Api from "../api/API";

const useAuthGuard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Api.signInCheck();
        setIsLoading(false);
      } catch {
        router.replace("/pages/user/signin");
      }
    };

    checkAuth();
  }, [router]);
  return isLoading;
};

export default useAuthGuard;
