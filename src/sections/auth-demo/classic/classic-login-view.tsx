'use client';

import * as Yup from 'yup';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { FIREBASE_API } from 'src/config-global';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { initializeApp } from 'firebase/app';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui






// routes


// hooks

// components


// import { AuthContext } from 'src/auth/context/amplify';





// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
};

export default function ClassicLoginView() {
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const router = useRouter();

  const firebaseApp = initializeApp(FIREBASE_API);
  const onSubmit = useCallback(async (data: FormValuesProps) => {
    try {
      // console.log(user)
      signInWithEmailAndPassword(getAuth(firebaseApp), data.email, data.password).then((userCredential)=>{
        const user1 = userCredential.user;
        console.log(user1)
        router.prefetch("comming-soon");
        router.push("coming-soon");
      }).catch((error)=>{
    //     const errorCode = error.code;
    // const errorMessage = error.message;
    alert("Djt me sai roi")

      })
      // login(data.email, data.password).then(()=>{console.log("Test")})
      // memoizedValue.login(data.email, data.password).then(()=>{console.log("S")})
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4" align='center'>Sign in to Accountant Solution System</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.authDemo.classic.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
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
        href={paths.authDemo.classic.forgotPassword}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
