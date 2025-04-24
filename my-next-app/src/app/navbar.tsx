"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RootState } from "@/app/store/store";
import {  useSelector } from "react-redux";
//import { signin, signout } from "@/app/store/userSlice";

const Navbar = () => {
  const router = useRouter();
  //const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log("로그인됨?",isLoggedIn)
  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      //dispatch(signout());
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link href="/">My Logo</Link>
        </div>

        <div className="flex space-x-6">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Home
          </Link>
          <Link
            href="/pages/bbs/board/1"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            BBS
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/pages/user/profile"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-300 transition duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/pages/user/signin"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/pages/user/signup"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
