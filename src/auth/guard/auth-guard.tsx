import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';
import axios from 'axios';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
};

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(async () => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({ returnTo: window.location.href }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace('');
    } else {
      const uid = sessionStorage.getItem('uid');
      const token = sessionStorage.getItem('token');
      if (uid) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/users/${uid}/roles`;
        const resp = await axios.get(url, config);
        if (resp.status === 200) {
          setChecked(true);
          sessionStorage.setItem('roleCode', resp.data.roleCode);
          router.prefetch('dashboard/mail');
          router.prefetch('dashboard');
          if (`${resp.data.roleCode}_`.includes('ACCOUNTANT')) {
            // if user is accountant navigate to mail as default screen
            router.replace('dashboard/mail');
          } else {
            router.replace('dashboard');
          }
        } else {
          router.replace('');
        }
      } else {
        router.replace('');
      }

    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
