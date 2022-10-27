import { AppBar, IconButton, Typography, Button, Toolbar } from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import AdbIcon from '@mui/icons-material/Adb';

export default function CustomAppBar() {
  const [isAuthenticated, setAuthenticated] = useAuth();

  const doLogout = async () => {
    await axios.post(
      'http://localhost:4000/api/users/logout',
      {},
      {
        withCredentials: true
      }
    );

    setAuthenticated(false);
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
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <AdbIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GitHub Jobs
        </Typography>

        {isAuthenticated ? (
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
