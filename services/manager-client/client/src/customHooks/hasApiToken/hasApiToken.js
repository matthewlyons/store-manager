import { useContext } from 'react';

// Context
import { StoreContext } from '../../context/StoreContext';

export default function useAuthToken() {
  const { state } = useContext(StoreContext);
  let currentTime = Date.now();
  return state.apiAuth.exp > currentTime;
}
