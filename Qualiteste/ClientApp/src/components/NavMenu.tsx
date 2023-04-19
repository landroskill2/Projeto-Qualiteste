import React, { Component, useCallback, useEffect, useState } from 'react';
import CustomNavLink from './CustomNavLink';
import AppRoutes from '../common/AppRoutes';


export default function NavMenu() {
  const [toggleNav, setToggleNav] = useState<boolean>(false);
  const changeToggle = useCallback(() => {
    setToggleNav(!toggleNav);
  }, [toggleNav]);
  
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (toggleNav) {
        const target = e.target;
        const navMenu = document.getElementById("navmenu")!;
        if (!navMenu.contains(target as Node)) {
          changeToggle();
        }
      }
    });
  },[changeToggle, toggleNav]);

  return (
    <header
      id="navmenu"
      className={"sticky top-0 !z-[1000] shadow-sm shadow-slate-600"}
    >
      <nav className="bg-slate-900 border-gray-200 px-2 sm:px-4 py-2.5">
        <div className="container-fluid flex flex-wrap w-full items-center">
          <span
            className="text-white"
            id="nav-title"
            onClick={() => AppRoutes.navigate("/")}
          >
            Qualiteste
          </span>
          <div
            className={"hidden w-full md:block md:w-auto"}
            id="navbar-default"
          >
            <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-slate-800 md:bg-slate-900 border-slate-700 !text-white dark:hover:!text-sky-400">
              <li className="text-white">
                <CustomNavLink href="/" toggleNavBar={changeToggle}>
                  Home
                </CustomNavLink>
              </li>
              <li className="text-white">
                <CustomNavLink href="/consumers" toggleNavBar={changeToggle}>
                  Provadores
                </CustomNavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}