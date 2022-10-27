import getAuth from './getAuth';

export const assertCtx = ({ req, res }) => {
  if (!req) {
    throw new Error('Request is not available');
  }
  if (!res) {
    throw new Error('Response is not available');
  }
};

export default function withPageAuthRequired() {
  return (optsOrComponent, csrOpts) => {
    if (typeof optsOrComponent === 'function') {
      // TODO: add logic for CSR
      // return withPageAuthRequiredCSR(optsOrComponent, csrOpts);
    }

    const loginUrl = '/login';
    const { getServerSideProps, returnTo } = optsOrComponent;

    return async function getAuthenticatedServerSideProps(ctx) {
      assertCtx(ctx);

      const user = await getAuth(ctx);
      console.log('asdasd');

      if (!user) {
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

      if (getServerSideProps) {
        ret = await getServerSideProps(ctx);
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
  };
}
