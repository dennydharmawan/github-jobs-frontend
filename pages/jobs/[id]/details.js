import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AdbIcon from '@mui/icons-material/Adb';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import differenceInDays from 'date-fns/differenceInDays';
import { useRouter } from 'next/router';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Index() {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, error, data } = useQuery(
    ['jobs', id],
    () =>
      axios.get(`http://localhost:4000/api/jobs/${id}/details`, {
        withCredentials: true
      }),
    {
      enabled: Boolean(id)
    }
  );

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        backgroundColor: '#e1e1e1',
        display: 'flex',
        flexFlow: 'column',
        minHeight: '100vh'
      }}
    >
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
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          paddingInline: '2.5rem',
          paddingBlock: '1.5rem'
        }}
      >
        <Button variant="outlined" href="/" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Typography variant="h6">Job Description</Typography>
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.description }}
        ></div>
      </Box>
    </Container>
  );
}
