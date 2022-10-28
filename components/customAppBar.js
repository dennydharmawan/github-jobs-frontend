import {
  AppBar,
  IconButton,
  Box,
  Typography,
  Button,
  Toolbar
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import AdbIcon from '@mui/icons-material/Adb';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

export default function CustomAppBar({ user }) {
  const router = useRouter();
  const [localUser, setLocalUser] = useState(user);

  const doLogout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/logout`,
      {},
      {
        withCredentials: true
      }
    );

    setLocalUser(false);
    router.push('/');
  };

  return (
    <AppBar
      elevation={0}
      component="nav"
      position="sticky"
      sx={{
        backgroundColor: '#4267B2',
        paddingInline: '1rem'
      }}
    >
      <Toolbar>
        <Link href="/">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 'auto'
            }}
          >
            <AdbIcon sx={{ marginRight: '1rem' }} />

            <Typography variant="h6" component="div" sx={{ fontSize: '24px' }}>
              GitHub Jobs
            </Typography>
          </Box>
        </Link>

        {localUser ? (
          <Button color="inherit" onClick={doLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" href="/login">
              Login
            </Button>

            <Button color="inherit" href="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
