import axios from 'axios';
import cookie from 'cookie';

export default async function getAuth(context) {
  const request = context.req;

  let user = null;
  if (request && request.cookies.token) {
    request.cookies = cookie.parse(request.headers.cookie || '');

    const result = await axios.post(
      'http://localhost:4000/api/users/authenticate',
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${request.cookies.token}`
        }
      }
    );

    if (result?.data) {
      user = result?.data;
    }
  }

  return user;
}
