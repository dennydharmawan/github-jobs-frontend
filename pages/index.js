import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import AdbIcon from '@mui/icons-material/Adb';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import differenceInDays from 'date-fns/differenceInDays';
import Link from 'next/link';

export default function Index() {
  const { isLoading, error, data } = useQuery(['jobs'], () =>
    fetch('http://localhost:4000/api/jobs').then((res) => {
      return res.json();
    })
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

          <Button color="inherit" href="/login">
            Login
          </Button>

          <Button color="inherit" href="/register">
            Register
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingInline: '2.5rem', paddingBlock: '1.5rem' }}>
        <Typography variant="h6">Job Description</Typography>
      </Box>

      <Box sx={{ paddingInline: '2.5rem', paddingBlock: '1.5rem' }}>
        <Box
          sx={{
            backgroundColor: '#FAFAFA',
            padding: '1.5rem'
          }}
        >
          <Typography
            sx={{ marginBottom: '1.5rem' }}
            variant="h6"
            fontWeight={1000}
          >
            Job List
          </Typography>
          <Box>
            <Box>
              <Box>
                {isLoading && <CircularProgress />}
                {data &&
                  data?.map((job, index) => {
                    return (
                      <Box key={index}>
                        <Divider />
                        <Link
                          href={`/jobs/${job.id}/details`}
                          style={{ textDecoration: 'none', cursor: 'pointer' }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              paddingBlock: '1rem'
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{ color: '#4267B2' }}
                              >
                                {job.title}
                              </Typography>
                              <Box sx={{ display: 'flex' }}>
                                <Typography
                                  variant="body1"
                                  fontWeight={500}
                                  sx={{ color: '#7d7d7d' }}
                                >
                                  {job.company} - &nbsp;
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontWeight={600}
                                  sx={{ color: '#1a8d1a' }}
                                >
                                  {job.type}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{ marginLeft: 'auto', textAlign: 'right' }}
                            >
                              <Typography sx={{ padding: '0.25rem' }}>
                                {job.location}
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                sx={{ color: '#7d7d7d' }}
                              >
                                {Math.floor(Math.random() * 10) + 1}
                                {/* {differenceInDays(
                                new Date(),
                                Date.parse(job.createdAt)
                              )} */}
                                &nbsp;days ago
                              </Typography>
                            </Box>
                          </Box>
                        </Link>
                      </Box>
                    );
                  })}

                <Box sx={{ display: 'flex', marginTop: '1.5rem' }}>
                  <Button variant="contained" sx={{ width: '100%' }}>
                    More jobs
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
