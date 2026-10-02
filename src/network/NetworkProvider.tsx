import NetInfo from '@react-native-community/netinfo';
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

type NetworkContextType = {
  isOnline: boolean;
};

export const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined
);

type NetworkProviderProps = {
  children: ReactNode;
};

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      setIsOnline(connected);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isOnline,
    }),
    [isOnline]
  );

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}