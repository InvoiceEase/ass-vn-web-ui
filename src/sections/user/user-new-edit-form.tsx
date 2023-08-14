import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// types
import { IAuditorItem, IUserItem } from 'src/types/profile';
// assets
import { countries } from 'src/assets/data';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { InputAdornment, Alert } from '@mui/material';
import axios from 'axios';
import CompanySelectionDropdown from 'src/layouts/_common/company-selection-dropdown/company-selection-dropdown';
import BusinessPicker from 'src/components/business-picker/business-picker';
import { IAuditor } from 'src/types/auditor';
import { API_ENDPOINTS } from 'src/utils/axios';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  currentUser?: IAuditor;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openPop, setOpenPop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    debugger
    try {
       axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.users.detail}${currentUser?.id}`,
        {
          headers: headersList,
        }
      ).then((resp)=>{
        debugger

      });

    } catch (e) {
      console.log('e', e);
    }
  }, []);
  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      password: currentUser?.password || '',
      role: currentUser?.role || 'AUDITOR',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        setError(false);
        data.phoneNumber = `+84${data.phoneNumber.substring(1)}`;
        const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/auth`;
        await axios.post(url, data);
        // if (response.data.status === 200){

        // }
        reset();
        enqueueSnackbar(currentUser ? 'Cập nhật thành công' : 'Thêm thành công');
        router.push(paths.dashboard.user.list);
      } catch (e) {
        const errorMess = currentUser ? 'Chỉnh sửa thất bại' : 'Thêm thất bại';
        setErrorMsg(errorMess);
        setError(true);
      }
    },
    [currentUser, enqueueSnackbar, reset, router]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleCompClick = () => {
    setOpenPop(true);
  };

  return (
    <>
      {openPop && <BusinessPicker />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Thêm auditor
              </Typography>
              {error && (
                <Alert sx={{ mb: 2 }} severity={error ? 'error' : 'success'}>
                  {errorMsg}
                </Alert>
              )}

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="fullName" label="Full Name" />
                <RHFTextField name="email" label="Email Address" />
                <RHFTextField name="phoneNumber" label="Phone Number" />

                <RHFTextField
                  name="password"
                  label="Password"
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField disabled name="role" label="Role" value="AUDITOR" />
              </Box>
              {currentUser && (
                <Stack sx={{ mt: 5 }}>
                  <LoadingButton
                    onClick={handleCompClick}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Đăng ký công ty
                  </LoadingButton>
                </Stack>
              )}
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Thêm' : 'Lưu'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
