/** @format */
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '@/components/page-structure';
import { routes } from '@/router/routes';
import { useSetIsAuthenticated } from '@/store/slices/sessions/hooks';

import { LoginPagePropsType } from './types';

const Login: React.FunctionComponent<LoginPagePropsType> = ({}) => {
  const setIsAuthenticated = useSetIsAuthenticated();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const authenticate = useCallback(() => {
    setIsAuthenticated(true);
    setCookie('is-authenticated', 'true');
    navigate(searchParams.get('next') || routes.home.path);
  }, [setIsAuthenticated, searchParams, navigate, setCookie]);

  return (
    <Main>
      <button onClick={authenticate}>Login</button>
    </Main>
  );
};

export default Login;
