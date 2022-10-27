import React, { useState, useLayoutEffect, useEffect } from 'react';
import axios from 'axios';

// this cause flicker when axios is fetching
export default function useAuth(props) {
  const [isAuthenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.post(
        'http://localhost:4000/api/users/authenticate',
        {},
        {
          withCredentials: true
        }
      );

      if (data?.isAuthenticated) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    })();
  });

  return [isAuthenticated, setAuthenticated];
}
