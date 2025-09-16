// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import signupImg from "../assets/signup.jpg";
export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Handle Email/Password Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Account created:", { firstName, lastName, email });
      navigate("/"); // redirect to Home
    } catch (err) {
      setError(err.message);
      console.error("❌ Error creating account:", err.message);
    }
  };

  // 🔹 Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("✅ Google sign in success");
      navigate("/"); // redirect to Home
    } catch (err) {
      setError(err.message);
      console.error("❌ Google sign in error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7de0e6] via-[#f0f8ff] to-[#f4a6cd] flex items-center p-4">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left side - Sign up form */}
        <div className="w-full max-w-md ml-5">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-600 mb-4">Please register to continue.</p>

            {/* Error message */}
            {error && (
              <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="keep-logged-in"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="keep-logged-in" className="ml-2 text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Sign Up
              </button>
            </form>

            {/* OR Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignUp}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Have an account? </span>
              <Link to="/signin" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Log In
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex flex-1 justify-center items-center ml-12">
          <img
            src={signupImg}
            alt="Join us online"
            className="w-full max-w-lg h-auto rounded-2xl shadow-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
