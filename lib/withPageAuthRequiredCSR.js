import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const defaultOnRedirecting = () => <></>;
const defaultOnError = () => <></>;

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function withPageAuthRequiredCSR(Component, options = {}) {
  return function WithPageAuthRequired(props) {
    const {
      willRedirect = false,
      returnTo,
      onRedirecting = defaultOnRedirecting,
      onError = defaultOnError
    } = options;
    const loginUrl = '/login';
    const {
      isLoading,
      error,
      data: user
    } = useQuery(['auth'], () =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/authenticate`,
        {},
        {
          withCredentials: true
        }
      )
    );

    useEffect(() => {
      if ((user && !error) || isLoading) return;
      if (willRedirect) {
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

    if (error) return onError(error);
    if (user) return <Component user={user} {...props} />;

    return onRedirecting();
  };
}
