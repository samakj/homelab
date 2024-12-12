/** @format */
import { useAction } from '@/common/hooks/reducer';

import { sessionsSlice } from '.';

export const useSetIsAuthenticated = () => useAction(sessionsSlice.actions.setIsAuthenticated);
