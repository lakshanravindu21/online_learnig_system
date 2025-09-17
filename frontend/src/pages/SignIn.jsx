import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { auth, googleProvider } from "../firebase";
import signinImg from "../assets/signin.jpg";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, keepLoggedIn ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in:", userCredential.user.email);
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("❌ Login error:", err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("✅ Google login success");
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("❌ Google login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e0f7fa] via-[#f0f8ff] to-[#fff0f5] flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Left - Form */}
        <div className="w-full lg:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign in</h1>
          <p className="text-gray-600 mb-8">Please login to continue to your account.</p>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2">Keep me logged in</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
            >
              Sign in
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Need an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={signinImg}
            alt="Sign in illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
