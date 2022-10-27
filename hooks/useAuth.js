import React, { useState, useLayoutEffect, useEffect } from 'react';
import axios from 'axios';

import { useQuery } from '@tanstack/react-query';

export default function useAuth() {
  const { isLoading, error, data } = useQuery(['auth'], () =>
    axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/authenticate`,
      {},
      {
        withCredentials: true
      }
    )
  );

  return [user, error, isLoading];
}
