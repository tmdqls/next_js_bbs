"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@/app/store/userSlice";
import {  useState } from "react";
import Confirm from "./components/Confirm";
import { setAlert } from "@/app/store/alertSlice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleLogout = async () => {
    setShowConfirm(false);

    const resultAction = await dispatch(signout());
    if (signout.fulfilled.match(resultAction)) {
      router.push("/");
      dispatch(setAlert({ msg: "サインアウトに成功しました。", msgType: "success" }));
    } else {
      dispatch(setAlert({ msg: "サインアウトに失敗しました。", msgType: "error" }));
    }
  };
  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  const triggerLogout = () => {
    setShowConfirm(true);
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
                onClick={triggerLogout}
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
      {showConfirm && (
        <Confirm
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;
