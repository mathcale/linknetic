/* eslint-disable @next/next/no-img-element */
import { MouseEvent } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

import { SignOut } from '../../hooks/auth-user.hook';

export interface NavbarProps {
  title?: string;
  user: User;
}

export default function Navbar({ title, user }: NavbarProps) {
  const onSignOutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    SignOut();
  };

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
