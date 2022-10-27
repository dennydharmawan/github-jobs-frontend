import { withPageAuthRequiredFactory } from '@auth0/nextjs-auth0/dist/helpers';
import getAuth from './getAuth';
// import { withPageAuthRequired } from '@auth0/nextjs-auth0';

// https://github.com/vercel/next.js/discussions/10925
// https://github.com/auth0/nextjs-auth0/issues/129

export const assertCtx = ({ req, res }) => {
  if (!req) {
    throw new Error('Request is not available');
  }
  if (!res) {
    throw new Error('Response is not available');
  }
};

// inspired by -- import { withPageAuthRequired } from '@auth0/nextjs-auth0';
export default function withPageAuthRequired(
  willRedirect = false,
  getServerSidePropsFunc,
  returnTo
) {
  // the function below is the new getServerSideProps
  return async function getAuthenticatedServerSideProps(ctx) {
    assertCtx(ctx);

    const user = await getAuth(ctx);
    const loginUrl = '/login';

    if (!user && willRedirect) {
      // 10 - redirect
      // 9.5.4 - unstable_redirect
      // 9.4 - res.setHeaders
      return {
        redirect: {
          destination: `${loginUrl}?returnTo=${encodeURIComponent(
            returnTo || ctx.resolvedUrl
          )}`,
          permanent: false
        }
      };
    }

    let ret = { props: {} };

    if (getServerSidePropsFunc) {
      ret = await getServerSidePropsFunc(ctx);
    }

    if (ret.props instanceof Promise) {
      return {
        ...ret,
        props: ret.props.then((props) => ({
          ...props,
          user
        }))
      };
    }

    return { ...ret, props: { ...ret.props, user } };
  };
}
