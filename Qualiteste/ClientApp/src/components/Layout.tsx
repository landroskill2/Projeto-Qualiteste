import React, { createContext, useContext } from 'react';
import NavMenu from './NavMenu';
import { Outlet } from 'react-router-dom';
import { Wrap } from '@chakra-ui/react';
import { useGlobalToast } from '../common/useGlobalToast';


export default function Layout() {

    return (
      <div className='flex flex-col w-full h-full font-Mukta'>
        <div className="sticky top-0 z-50">
          <NavMenu />
        </div>
        <div id="main-container " className='text-slate-800 dark:text-white items-center justify-center flex flex-col w-full flex-grow h-full bg-white'>
          <Outlet />
        </div>
      </div>
    );
}
