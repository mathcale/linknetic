/* eslint-disable @next/next/no-img-element */
import { MouseEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { themeChange } from 'theme-change';

import { SignOut } from '../../hooks/auth-user.hook';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';

export interface NavbarProps {
  title?: string;
  user: User;
}

export default function Navbar({ title, user }: NavbarProps) {
  const router = useRouter();

  const onSignOutClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    await SignOut();
    router.replace('/');
  };

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="navbar bg-primary shadow-xl rounded-box">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>

            <li>
              <Link href="/editor">Editor</Link>
            </li>

            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <a className="font-semibold normal-case text-xl">{title ? title : 'Linknetic'}</a>
      </div>

      <div className="navbar-end">
        <span className="mr-3 flex flex-row">
          <SunIcon width={18} className="inline" />

          <div className="w-10 mx-2">
            <span
              data-toggle-theme="dark"
              data-act-class="pl-4"
              className="border rounded-full border-neutral flex items-center cursor-pointer w-10 transition-all duration-300 ease-in-out pl-0"
            >
              <span className="rounded-full w-3 h-3 m-1 bg-neutral"></span>
            </span>
          </div>

          <MoonIcon width={18} className="inline" />
        </span>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={user.user_metadata.avatar_url} alt="User avatar" />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>

            <li>
              <a onClick={onSignOutClick}>Sign out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
