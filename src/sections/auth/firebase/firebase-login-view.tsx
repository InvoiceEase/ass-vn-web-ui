'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// config
// import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { GuestGuard } from 'src/auth/guard';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
};

export default function FirebaseLoginView() {
  const { user, login, loginWithGoogle, loginWithGithub, loginWithTwitter } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });
  const firebaseErrorCode = {
    userNotFound: 'Không tìm thấy thông tin tài khoản',
    wrongPassword: 'Sai tài khoản hoặc mật khẩu',
  };
  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await login?.(data.email, data.password);
      } catch (error) {
        reset();
        if (error.code === 'auth/user-disabled') {
          setErrorMsg('Bạn đã bị khoá tài khoản, vui lòng liên hệ quản lý hệ thống!');
        } else {
          setErrorMsg('Bạn đã nhập sai tài khoản hoặc mật khẩu!');
        }
      }
    },
    [login, reset, returnTo, user]
  );

  // const handleGoogleLogin = async () => {
  //   try {
  //     await loginWithGoogle?.();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleGithubLogin = async () => {
  //   try {
  //     await loginWithGithub?.();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleTwitterLogin = async () => {
  //   try {
  //     await loginWithTwitter?.();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Đăng nhập</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Chưa có tài khoản?</Typography>

        <Link component={RouterLink} href={paths.auth.firebase.register} variant="subtitle2">
          Đăng ký ngay
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email" />

      <RHFTextField
        name="password"
        label="Mật khẩu"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        component={RouterLink}
        href={paths.auth.firebase.forgotPassword}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Quên mật khẩu?
      </Link>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>
    </Stack>
  );

  // const renderLoginOption = (
  //   <div>
  //     <Divider
  //       sx={{
  //         my: 2.5,
  //         typography: 'overline',
  //         color: 'text.disabled',
  //         '&::before, ::after': {
  //           borderTopStyle: 'dashed',
  //         },
  //       }}
  //     >
  //       OR
  //     </Divider>

  //     <Stack direction="row" justifyContent="center" spacing={2}>
  //       <IconButton onClick={handleGoogleLogin}>
  //         <Iconify icon="eva:google-fill" color="#DF3E30" />
  //       </IconButton>

  //       <IconButton color="inherit" onClick={handleGithubLogin}>
  //         <Iconify icon="eva:github-fill" />
  //       </IconButton>

  //       <IconButton onClick={handleTwitterLogin}>
  //         <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
  //       </IconButton>
  //     </Stack>
  //   </div>
  // );

  return (
    <AuthClassicLayout>
      <GuestGuard>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {renderHead}

          {renderForm}

          {/* {renderLoginOption} */}
        </FormProvider>
      </GuestGuard>
    </AuthClassicLayout>
  );
}
