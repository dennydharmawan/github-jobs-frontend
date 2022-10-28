import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const defaultOnRedirecting = () => <></>;
const defaultOnError = () => <></>;
const defaultOnLoading = () => <></>;

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function withPageAuthRequiredCSR(Component, options = {}) {
  return function WithPageAuthRequired(props) {
    const {
      willRedirect = false,
      returnTo,
      onRedirecting = defaultOnRedirecting,
      onError = defaultOnError,
      onLoading = defaultOnLoading
    } = options;
    const loginUrl = '/login';
    const {
      isLoading,
      error,
      data: user
    } = useQuery(['auth'], () =>
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/authenticate`,
          {},
          {
            withCredentials: true
          }
        )
        .then((result) => {
          if (result?.data) {
            return result?.data;
          }

          return {
            isAuthenticated: false
          };
        })
    );

    useEffect(() => {
      if (isLoading) return;

      if (willRedirect && !user?.isAuthenticated) {
        let returnToPath;
        if (!returnTo) {
          const currentLocation = window.location.toString();
          returnToPath =
            currentLocation.replace(new URL(currentLocation).origin, '') || '/';
        } else {
          returnToPath = returnTo;
        }
        window.location.assign(
          `${loginUrl}?returnTo=${encodeURIComponent(returnToPath)}`
        );
      }
    }, [user, error, isLoading]);

    if (isLoading) return onLoading();

    if (error) return onError(error);

    if (willRedirect && !user?.isAuthenticated) {
      return onRedirecting();
    }

    return <Component user={user?.isAuthenticated ? user : null} {...props} />;
  };
}
