'use client'

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLogout } from '../hooks/useLogout';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { handleLogout, isLoggingOut } = useLogout();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, searchParams, isAuthenticated]);

  const handleLogin = () => {
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
  };

  const handleSignUp = () => {
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    router.push(`/signup?returnUrl=${encodeURIComponent(currentUrl)}`);
  };

  return (
    <header className="fixed top-[25px] right-6 sm:right-8 z-50">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 bg-[#03030352] rounded-full p-2 shadow-md"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            {isAuthenticated || user ? (
              <>
                <button
                  onClick={() => router.push('/create')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Create
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <span className="opacity-50">Logging out...</span>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
