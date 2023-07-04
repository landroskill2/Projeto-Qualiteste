import React, { createContext, useContext } from 'react';
import NavMenu from './NavMenu';
import { Outlet } from 'react-router-dom';
import { Wrap } from '@chakra-ui/react';
import { useGlobalToast } from '../common/useGlobalToast';

type ContextType = {
  addToast: ({ id, title, description, status, }: {
    id?: string | undefined;
    title: string;
    description: string;
    status: "success" | "error";
  }) => void,
  isToastActive: (toaster: string) => boolean
}

const ToastContext = createContext<ContextType>({
  addToast: () => {},
  isToastActive: () => false
})

export default function Layout() {
    const {addToast, isToastActive} = useGlobalToast()

    return (
      <div className='flex flex-col h-full w-full font-sans'>
        <NavMenu />
        <ToastContext.Provider value={{addToast : addToast, isToastActive : isToastActive}}>
          <div id="main-container" className='flex flex-col flex-1 m-5 max-h-full min-h-0 text-slate-800 dark:text-white'>
            <Outlet />
          </div>
        </ToastContext.Provider>
      </div>
    );
}

export function useAddToast(){
  return useContext(ToastContext).addToast
}

export function useIsToastActive(){
  return useContext(ToastContext).isToastActive
}
