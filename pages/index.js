import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import differenceInDays from 'date-fns/differenceInDays';
import Link from 'next/link';
import CustomAppBar from '../components/customAppBar';
import getAuth from '../lib/getAuth';
import cookie from 'cookie';
import axios from 'axios';
import withPageAuthRequired from '../lib/withPageAuthRequired';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import React from 'react';

export default function Index({ user }) {
  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = useInfiniteQuery(
    ['jobs'],
    async ({ pageParam = 0 }) => {
      const res = await axios.get(
        'http://localhost:4000/api/jobs?page=' + pageParam
      );

      return res.data;
    },
    {
      getPreviousPageParam: (current) =>
        current.page === 1 ? undefined : current.Page - 1,
      getNextPageParam: (current) =>
        current.page === current.total_pages ? undefined : current.page + 1
    }
  );

  // disable infinite scroll
  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [inView]);

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
      <CustomAppBar user={user} />
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
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography
              sx={{ marginBottom: '1.5rem' }}
              variant="h6"
              fontWeight={1000}
            >
              Job List
            </Typography>
            {isFetching && <CircularProgress />}
          </Box>

          <Box>
            <Box>
              <Box>
                {data?.pages &&
                  data.pages.map((page, pageIndex) => (
                    <React.Fragment key={pageIndex}>
                      {page?.data.map((job, jobIndex) => (
                        <React.Fragment key={jobIndex}>
                          <Divider />
                          <Link
                            href={`/jobs/${job.id}/details`}
                            style={{
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
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
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}

                <Box sx={{ display: 'flex', marginTop: '1.5rem' }}>
                  <Button
                    ref={ref}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    variant="contained"
                    sx={{ width: '100%' }}
                  >
                    {isFetchingNextPage
                      ? 'Loading more...'
                      : hasNextPage
                      ? 'More jobs'
                      : 'Nothing more to load'}
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

export const getServerSideProps = withPageAuthRequired(false);
