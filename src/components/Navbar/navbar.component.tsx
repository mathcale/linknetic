/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { User } from '@supabase/supabase-js';
import { MoonIcon, SunIcon, MenuAlt2Icon } from '@heroicons/react/outline';

import { SignOut } from '../../hooks/auth-user.hook';

export interface NavbarProps {
  title?: string;
  user: User | boolean;
}

export default function Navbar({ title, user }: NavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const themeToggleRef = useRef(null);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      themeToggleRef.current.checked =
        theme === process.env.NEXT_PUBLIC_DARK_THEME_NAME ? true : false;
    }
  }, [mounted]);

  const onThemeToggleClick = (e: ChangeEvent<HTMLInputElement>) => {
    setTheme(
      e.target.checked
        ? process.env.NEXT_PUBLIC_DARK_THEME_NAME
        : process.env.NEXT_PUBLIC_LIGHT_THEME_NAME
    );
  };

  const onSignOutClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    await SignOut();
    router.replace('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="navbar bg-base-100 shadow-xl rounded-box" aria-label="navbar">
      <div className="navbar-start">
        {user && (
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              aria-label="navbar-dropdown-button"
            >
              <MenuAlt2Icon width={24} />
            </label>

            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/management/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link href="/management/editor">Editor</Link>
              </li>

              <li>
                <Link href="/management/settings">Settings</Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="navbar-center">
        <a className="font-semibold normal-case text-xl">{title ? title : 'Linknetic'}</a>
      </div>

      <div className="navbar-end">
        <div className="form-control mr-3">
          <label className="label cursor-pointer">
            <span className="label-text">
              <SunIcon width={18} className="inline" />
            </span>

            <input
              type="checkbox"
              className="toggle mx-2"
              // @ts-ignore
              onClick={onThemeToggleClick}
              ref={themeToggleRef}
            />

            <span className="label-text">
              <MoonIcon width={18} className="inline" />
            </span>
          </label>
        </div>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={(user as User).user_metadata.avatar_url}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/management/profile">Profile</Link>
              </li>

              <li>
                <a onClick={onSignOutClick}>Sign out</a>
              </li>
            </ul>
          </div>
        ) : (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/auth">Sign in</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
