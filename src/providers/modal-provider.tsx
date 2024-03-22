'use client';

import { Agency, User } from '@prisma/client';
import React, { createContext, useContext, useEffect, useState } from 'react';



// Modal provider  --------------
interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
};

type ModelContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModelContextType>({
  data: {}, 
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showeingModel, setShoweingModel] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShoweingModel(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;
  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showeingModel}
    </ModalContext.Provider>
  );
};

// -------------- 



// useModal hook 
export const useModal = ()=>{
  const context = useContext(ModalContext)
if(!context){
throw new Error('useModal should be used within in the modal Provider')
}

return context
}


export default ModalProvider 