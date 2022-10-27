import { Box, TextField, Button, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import getAuth from '../lib/getAuth';

// TODO error handling
export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [message, setMessage] = useState('');

  const onSubmit = async (data, event) => {
    const { email, password } = data;

    const response = await axios.post(
      'http://localhost:4000/api/users/login',
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    );

    router.push('/');
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
              required: 'Required field',
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
          <Box sx={{ display: 'flex', marginTop: '1.5rem' }}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
