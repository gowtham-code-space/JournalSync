import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black p-4 sm:p-8">
      <img
        src="https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=2000&q=80"
        alt=""
        referrerPolicy="no-referrer"
        loading="eager"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-[700px] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-[#16161A] md:flex-row">
        <div className="relative hidden w-1/2 p-3 md:block">
          <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[20px] bg-black p-8 sm:p-10">
            <img
              src="https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=1200&q=80"
              alt=""
              referrerPolicy="no-referrer"
              loading="eager"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">A Wise Quote</span>
              <span className="h-px flex-1 max-w-[120px] bg-white/70" />
            </div>
            <div className="relative z-10">
              <h1 className="mb-6 font-serif text-5xl leading-[1.05] text-white sm:text-6xl">Get<br />Everything<br />You Want</h1>
              <p className="max-w-xs text-sm leading-relaxed text-white/85 sm:text-base">You can get everything you want if you work hard, trust the process, and stick to the plan.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2 sm:px-16">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-12 flex items-center justify-center gap-2">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 3C3 1 5 1 7 3C9 5 11 5 13 3C15 1 17 1 19 3" stroke="currentColor" className="text-black dark:text-white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 9C3 7 5 7 7 9C9 11 11 11 13 9C15 7 17 7 19 9" stroke="currentColor" className="text-black dark:text-white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 15C3 13 5 13 7 15C9 17 11 17 13 15C15 13 17 13 19 15" stroke="currentColor" className="text-black dark:text-white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-serif text-2xl tracking-tight dark:text-white">Cogie</span>
            </div>

            <div className="mb-9 text-center">
              <h2 className="mb-3 font-serif text-4xl sm:text-[2.6rem] dark:text-white">Welcome Back</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to access your account</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard') }}>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-200">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 transition focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 dark:bg-[#25252E] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-[#1E1E24] dark:focus:ring-white/10" />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-200">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 pr-11 text-sm text-gray-700 placeholder-gray-400 transition focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 dark:bg-[#25252E] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-[#1E1E24] dark:focus:ring-white/10" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex cursor-pointer select-none items-center gap-2 text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-black/20 dark:border-gray-700 dark:accent-white dark:focus:ring-white/20" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white">Forgot Password</a>
              </div>

              <button type="submit" className="mt-2 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}