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

export default function CustomAppBar({ user }) {
  const router = useRouter();

  const doLogout = async () => {
    await axios.post(
      'http://localhost:4000/api/users/logout',
      {},
      {
        withCredentials: true
      }
    );

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

        {user ? (
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
