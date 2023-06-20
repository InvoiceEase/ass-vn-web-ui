'use client';

import * as Yup from 'yup';

import { Autocomplete, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useCallback, useRef, useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hook';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui







// hooks

// routes


// auth

// components






import Button from '@mui/material/Button';
import {
  Autocomplete,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type FormValuesProps = {
  address: string;
  email: string;
  emailOrg: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  nameOrg: string;
  password: string;
  role: string;
  taxNumber: string;
};
// const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export default function FirebaseRegisterView() {
  const { register, loginWithGoogle, loginWithGithub, loginWithTwitter } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    emailOrg: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    // .matches(phoneRegExp, 'Phone number is not valid'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
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
        const body = {
          email: data.email,
          phoneNumber: `+84${data.phoneNumber.substring(1)}`,
          fullName: `${data.firstName} ${data.lastName}`,
          password: data.password,
          role: userRole,
          organization: {
            name: data.nameOrg,
            email: data.emailOrg,
            address: data.address,
            taxNumber: data.taxNumber,
          },
        };
        const url = 'https://ass-admin-dot-ass-capstone-project.df.r.appspot.com/ass-admin/auth'
        const response = await axios.post(url, body);
        if(response.status === 201){
          router.push("")
        }
      } catch (error) {
        console.error(error);
        reset();
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    [register, reset, router]
  );

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await loginWithTwitter?.();
    } catch (error) {
      console.error(error);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h2">Register</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href="" component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );
  const [userRole, setUserRole] = useState('ACCOUNTANT');
  const roleRef = useRef();
  const role = ['ACCOUNTANT', 'ORGANIZATION'];
  const handleAutoComplete = () => {
    if (roleRef.current) {
      setUserRole(roleRef.current);
    }
  };
  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <Typography variant="h5">Information</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="First name" />
        <RHFTextField name="lastName" label="Last name" />
      </Stack>
      <RHFTextField name="phoneNumber" label="Phone Number" />
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
      <Autocomplete
        id="free-solo-demo"
        ref={roleRef}
        options={role}
        onBlur={() => handleAutoComplete()}
        defaultValue="ACCOUNTANT"
        renderInput={(params) => <RHFTextField name="role" {...params} label="ROLE" />}
      />

      <Button
        fullWidth
        color="inherit"
        variant="contained"
        size="large"
        onClick={() => {
          setIsSubmit(true);
        }}
      >
        Next
      </Button>
    </Stack>
  );

  const renderForm2 = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <Typography variant="h5">Organization Information</Typography>

      <RHFTextField name="nameOrg" label="Organization Name" />
      <RHFTextField name="emailOrg" label="Email address" />
      <RHFTextField name="address" label="Address" />
      <RHFTextField name="taxNumber" type="number" label="Tax Number" />
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Create account
      </LoadingButton>
    </Stack>
  );
  const renderLoginOption = (
    <div>
      {/* <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider> */}

      {/* <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <Iconify icon="eva:google-fill" color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <Iconify icon="eva:github-fill" />
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
        </IconButton>
      </Stack> */}
    </div>
  );

  return (
    <AuthClassicLayout>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {renderHead}

        {isSubmit ? renderForm2 : renderForm}

        {renderTerms}

        {renderLoginOption}
      </FormProvider>
    </AuthClassicLayout>
  );
}
