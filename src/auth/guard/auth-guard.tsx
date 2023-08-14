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
        const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/users/${uid}`;
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
            router.prefetch(paths.dashboard.mail);
            router.replace(paths.dashboard.mail);
          } else if (
            resp.data.role.includes(`${RoleCodeEnum.BusinessPrefix}${RoleCodeEnum.Manager}`)
          ) {
            router.prefetch(paths.dashboard.root);
            router.replace(paths.dashboard.root);
          } else if (resp.data.role.includes(RoleCodeEnum.Admin)) {
            router.prefetch(paths.dashboard.user.list);
            router.replace(paths.dashboard.user.list);
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
