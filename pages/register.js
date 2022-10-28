import { Box, TextField, Button, Container, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Link from '../components/Link';

// TODO error handling
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [message, setMessage] = useState('');

  const onSubmit = async (data, event) => {
    const { email, name, password } = data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            name,
            password
          })
        }
      );

      if (response.ok) {
        const result = await response.json();

        setMessage('Your email has been successfully registered.');
      } else {
        const errorMessage = await response.text();

        throw new Error(errorMessage);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ maxWidth: '300px', margin: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: 'Field is required',
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
            fullWidth
            id="name"
            label="Name"
            name="name"
            {...register('name', {
              required: 'Field is required'
            })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'Field is required'
            })}
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
              Register
            </Button>

            <Typography variant="body1">
              Already have an account? Click{' '}
              <Link
                href="/login
              "
              >
                here
              </Link>{' '}
              to login
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
