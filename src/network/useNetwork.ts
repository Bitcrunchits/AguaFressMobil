import { useContext } from 'react';

import { NetworkContext } from './NetworkProvider';

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error(
      'useNetwork debe utilizarse dentro de NetworkProvider'
    );
  }

  return context;
}
