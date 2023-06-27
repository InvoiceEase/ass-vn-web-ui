import { useCallback, useEffect } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const check = useCallback(async () => {
    const roleCode = await sessionStorage.getItem('roleCode');

    if (authenticated) {
      if (roleCode === 'ACCOUNTANT') {
        router.replace(paths.dashboard.mail);
      } else {
        router.replace(paths.dashboard.root);
      }
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
