import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {
  AppBar,
  Toolbar,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
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
import { useEffect, useState } from 'react';
import React from 'react';
import { AdbOutlined } from '@mui/icons-material';
import PublicIcon from '@mui/icons-material/Public';
import WorkIcon from '@mui/icons-material/Work';

export default function Index({ user }) {
  const { ref, inView } = useInView();

  const [filters, setFilters] = useState(null);

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
    ['jobs', filters],
    async ({ pageParam = 0 }) => {
      let res;

      if (!filters) {
        res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs?page=${pageParam}`
        );
      } else {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/search?page=${pageParam}`,
          filters
        );
      }

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

      <Box
        sx={{
          display: 'grid',
          rowGap: '0.2rem',
          columnGap: '1rem',
          gridTemplateAreas: `
            "header1 header1 header2 header2 empty"
            "input1 input1 input2 input2  search"
          `,
          paddingInline: '2.5rem',
          marginTop: '1rem'
        }}
      >
        <Box
          sx={{
            gridArea: 'header1'
          }}
        >
          <Typography variant="body1" fontWeight="600">
            Job Description
          </Typography>
        </Box>

        <TextField
          id="outlined-basic"
          label={
            <React.Fragment>
              <WorkIcon fontSize="small" />
              Filter by title, benefits, companies, expertise
            </React.Fragment>
          }
          variant="outlined"
          size="small"
          sx={{
            gridArea: 'input1',
            '& .MuiFormLabel-root': {
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              '& .myIcon': {
                paddingLeft: '8px',
                order: 999
              }
            }
          }}
        />

        <Box
          sx={{
            gridArea: 'header2'
          }}
        >
          <Typography variant="body1" fontWeight="600">
            Location
          </Typography>
        </Box>

        <TextField
          id="outlined-basic"
          variant="outlined"
          size="small"
          label={
            <React.Fragment>
              <PublicIcon fontSize="small" />
              Filter by city, state, zip code, or country
            </React.Fragment>
          }
          sx={{
            gridArea: 'input2',
            '& .MuiFormLabel-root': {
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              '& .myIcon': {
                paddingLeft: '8px',
                order: 999
              }
            }
          }}
        />

        <Box
          sx={{
            gridArea: 'search',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Full Time Only" />
          </FormGroup>
          <Button
            onClick={() =>
              setFilters({
                company: 'Sweet',
                type: 'Full Time'
              })
            }
            variant="contained"
            size="small"
            sx={{ height: '32px' }}
          >
            Search
          </Button>

          <Button
            onClick={() => setFilters(null)}
            variant="contained"
            size="small"
            sx={{ height: '32px' }}
          >
            Reset
          </Button>
        </Box>
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
