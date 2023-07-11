import React, { createContext, useContext } from 'react';
import NavMenu from './NavMenu';
import { Outlet } from 'react-router-dom';
import { Wrap } from '@chakra-ui/react';
import { useGlobalToast } from '../common/useGlobalToast';


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
