import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface DialogContextType {
  isSubOnlyDialogOpen: boolean;
  setIsSubOnlyDialogOpen: Dispatch<SetStateAction<boolean>>;
  toggleSubOnlyDialog: () => void;
  isLoginDialogOpen: boolean;
  setIsLoginDialogOpen: Dispatch<SetStateAction<boolean>>;
  toggleLoginDialog: () => void;
  isUpgradeDialogOpen: boolean;
  setIsUpgradeDialogOpen: Dispatch<SetStateAction<boolean>>;
  toggleUpgradeDialog: () => void;
}

const AuthDialogContext = createContext<DialogContextType | undefined>(
  undefined
);

interface DialogProviderProps {
  children: ReactNode;
}

export const AuthDialogProvider: React.FC<DialogProviderProps> = ({
  children,
}) => {
  const [isSubOnlyDialogOpen, setIsSubOnlyDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const toggleLoginDialog = () => {
    setIsLoginDialogOpen(!isLoginDialogOpen);
  };

  const toggleSubOnlyDialog = () => {
    setIsSubOnlyDialogOpen(!isSubOnlyDialogOpen);
  };

  const toggleUpgradeDialog = () => {
    setIsUpgradeDialogOpen(!isUpgradeDialogOpen);
  };

  return (
    <AuthDialogContext.Provider
      value={{
        isSubOnlyDialogOpen,
        setIsSubOnlyDialogOpen,
        toggleSubOnlyDialog,
        isLoginDialogOpen,
        setIsLoginDialogOpen,
        toggleLoginDialog,
        isUpgradeDialogOpen,
        setIsUpgradeDialogOpen,
        toggleUpgradeDialog,
      }}
    >
      {children}
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = (): DialogContextType => {
  const context = useContext(AuthDialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
