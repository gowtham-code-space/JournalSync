import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Page background image */}
      <img
        src="https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=2000&q=80"
        alt=""
        referrerPolicy="no-referrer"
        loading="eager"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
      />
      {/* darken so the white card pops */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-6xl rounded-[28px] overflow-hidden shadow-2xl bg-white dark:bg-[#16161A] flex flex-col md:flex-row min-h-[700px]">
        {/* Left panel - image with quote (hidden on mobile) */}
        <div className="relative w-full md:w-1/2 p-3 hidden md:block">
          <div className="relative h-full min-h-[320px] md:min-h-0 rounded-[20px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 bg-black">
            <img
              src="https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=1200&q=80"
              alt=""
              referrerPolicy="no-referrer"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* dark overlay for text legibility */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Top: eyebrow label */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-white text-xs font-semibold tracking-[0.2em] uppercase">
                A Wise Quote
              </span>
              <span className="h-px flex-1 max-w-[120px] bg-white/70" />
            </div>

            {/* Bottom: heading + copy */}
            <div className="relative z-10">
              <h1 className="font-serif text-white text-5xl sm:text-6xl leading-[1.05] mb-6">
                Get
                <br />
                Everything
                <br />
                You Want
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xs">
                You can get everything you want if you work hard, trust the
                process, and stick to the plan.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-10">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 3C3 1 5 1 7 3C9 5 11 5 13 3C15 1 17 1 19 3"
                  stroke="currentColor"
                  className="text-black dark:text-white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1 9C3 7 5 7 7 9C9 11 11 11 13 9C15 7 17 7 19 9"
                  stroke="currentColor"
                  className="text-black dark:text-white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1 15C3 13 5 13 7 15C9 17 11 17 13 15C15 13 17 13 19 15"
                  stroke="currentColor"
                  className="text-black dark:text-white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-serif text-2xl tracking-tight dark:text-white">Cogie</span>
            </div>

            {/* Heading */}
            <div className="text-center mb-9">
              <h2 className="font-serif text-4xl sm:text-[2.6rem] mb-3 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your email and password to access your account
              </p>
            </div>

            {/* Form */}
            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl bg-gray-100 dark:bg-[#25252E] border border-transparent px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:bg-gray-50 dark:focus:bg-[#1E1E24] transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl bg-gray-100 dark:bg-[#25252E] border border-transparent px-4 py-3 pr-11 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:bg-gray-50 dark:focus:bg-[#1E1E24] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-black dark:text-white focus:ring-black/20 dark:focus:ring-white/20 accent-black dark:accent-white"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white font-medium"
                >
                  Forgot Password
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3.5 text-sm font-semibold hover:bg-gray-900 dark:hover:bg-gray-100 transition mt-2"
              >
                Sign In
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-[#2C2C35] rounded-xl py-3.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1E1E24] transition"
              >
                <GoogleIcon />
                Sign In with Google
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-black dark:text-white font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}