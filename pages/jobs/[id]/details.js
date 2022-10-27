import AdbIcon from '@mui/icons-material/Adb';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Box
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAppBar from '../../../components/customAppBar';

import { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import withPageAuthRequired from '../../../lib/withPageAuthRequired';

export default function Details() {
  // const [isAuthenticated] = useAuth();
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
      <CustomAppBar />

      <Box
        sx={{
          paddingInline: '2.5rem',
          paddingBlock: '1.5rem'
        }}
      >
        <Button variant="outlined" href="/" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Typography variant="h6" sx={{ marginTop: '1rem' }}>
          Job Description
        </Typography>
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.description }}
        ></div>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withPageAuthRequired();
