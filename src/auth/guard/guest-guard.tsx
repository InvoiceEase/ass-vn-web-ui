import { useCallback, useEffect } from 'react';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
//
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const roleCode = sessionStorage.getItem('roleCode');

  const check = useCallback(() => {
    if (authenticated) {
      if (roleCode?.includes(RoleCodeEnum.AccountantPrefix)) {
        router.replace(paths.dashboard.mail);
      } else {
        router.replace(paths.dashboard.root);
      }
    }
  }, [authenticated, router, roleCode]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
