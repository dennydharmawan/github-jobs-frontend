import { Box, TextField, Button, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import { useState } from 'react';

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
    // event.preventDefault();
    const response = await fetch('http://localhost:4000/api/users/register', {
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
    });

    const result = await response.json();

    if (result.errors) {
      setMessage(data.errors);
    } else {
      setMessage('Your email has been successfully registered.');
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
            id="name"
            label="Name"
            name="name"
            {...register('name')}
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
              Register
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
