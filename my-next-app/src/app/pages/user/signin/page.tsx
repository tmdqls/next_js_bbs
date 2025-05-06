"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { signin } from "@/app/store/userSlice";
import { setAlert } from "@/app/store/alertSlice";

const SignInPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(signin({ email, password }));

    if (signin.fulfilled.match(resultAction)) {
      router.push("/");
      dispatch(setAlert({ msg: "サインインしました。", msgType: "success" }));
    } else {
      dispatch(setAlert({ msg: "Emailまたはパスワードに誤りがあります。", msgType: "error" }));
    }
  };

  return (
      <div className="flex min-h-[calc(100vh-20rem)] justify-center items-center bg-gray-100 rounded-xl">
        <form
          onSubmit={handleLogin}
          className="w-80 sm:w-96 md:w-80 lg:w-96 p-8 border-2 border-gray-300 rounded-xl shadow-lg bg-white"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
            Sign In
          </h2>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
              placeholder="E-Mailを入力してください"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              PassWord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
              placeholder="パスワードを入力してください"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
  );
};

export default SignInPage;
