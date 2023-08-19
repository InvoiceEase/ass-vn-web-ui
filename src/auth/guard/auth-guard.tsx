import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useAuthContext } from '../hooks';

// routes

//

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

  const { authenticated, method, logout } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const parseJWT = (token: string) =>
    JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  const check = useCallback(async () => {
    if (!authenticated) {
      router.replace('');
    } else {
      // await logout();
      const defaultDate = new Date().getTime();
      const uid = sessionStorage.getItem('uid');
      const token = sessionStorage.getItem('token');
      const JWT = parseJWT(token ?? '');
      const date = JWT.exp;
      if (date > defaultDate) {
        console.log('LOG OUT');
        await logout();
        router.replace('');
        return;
      }
      if (uid) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/users/${uid}`;
        try {
          const resp = await axios.get(url, config);
          if (resp.status === 200) {
            setChecked(true);
            // sessionStorage.setItem('roleCode', resp.data.roleCode);
            sessionStorage.setItem('userId', resp.data.id);
            sessionStorage.setItem('userName', resp.data.name);
            sessionStorage.setItem('roleCode', resp.data.role);
            sessionStorage.setItem('orgId', resp.data.organizationId);
            if (resp.data.role.includes(RoleCodeEnum.Auditor)) {
              // if user is accountant navigate to mail as default screen
              // router.prefetch(paths.dashboard.mail);
              router.replace(paths.dashboard.mail);
            } else if (
              resp.data.role.includes(`${RoleCodeEnum.BusinessPrefix}${RoleCodeEnum.Manager}`)
            ) {
              // router.prefetch(paths.dashboard.root);
              router.replace(paths.dashboard.root);
            } else if (resp.data.role.includes(RoleCodeEnum.Admin)) {
              // router.prefetch(paths.dashboard.user.list);
              router.replace(paths.dashboard.user.list);
            }
          } else {
            router.replace('');
          }
        } catch (e) {
          console.log('error', e);
          router.back();
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
