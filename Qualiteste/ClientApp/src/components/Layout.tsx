import React from 'react';
import NavMenu from './NavMenu';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
      <div className='flex flex-col h-full w-full font-sans'>
        <NavMenu />
        <div id="main-container" className='flex flex-col flex-1 m-5 max-h-full min-h-0 text-slate-800 dark:text-white'>
          <Outlet />
        </div>
      </div>
    );
}
