// @mui

// import { alpha, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Logo from 'src/components/logo';
// import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
// import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// import { bgGradient } from 'src/theme/css';
import { paths } from 'src/routes/paths';
// import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Image from 'next/image';

// auth

// routes


// hooks

// theme

// components


// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  // const { method } = useAuthContext();

  // const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  // const renderLogo = (
  //   <Image src="/assets/illustrations/ASS_Light_Mode.svg" alt='' width={100} height={100}/>
  // );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}

    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Hi, Welcome back'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/ASS_Light_Mode.svg'}
        sx={{ maxWidth: 720 }}
      />


    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}
