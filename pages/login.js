import { Box, TextField, Button, Container, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import getAuth from '../lib/getAuth';
import Link from '../components/Link';

// TODO error handling
export default function Login() {
  const router = useRouter();
  const returnTo = router.query?.returnTo;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [message, setMessage] = useState('');

  const onSubmit = async (data, event) => {
    const { email, password } = data;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`,
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      );

      router.push(returnTo || '/');
    } catch (error) {
      setMessage(
        error?.response?.data || error?.message || 'something went wrong'
      );
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ maxWidth: '300px', margin: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={!!errors?.email}
            helperText={errors?.email ? errors.email.message : null}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')}
          />

          <Box>{message}&nbsp;</Box>
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'column',
              gap: '0.5rem',
              marginTop: '1.5rem'
            }}
          >
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>

            <Typography variant="body1">
              Don't have an account? Click <Link href="/register">here</Link> to
              register
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
