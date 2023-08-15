import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// types
import { IUserItem } from 'src/types/profile';
// assets
// components
import { Alert, InputAdornment } from '@mui/material';
import axios from 'axios';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { getBusinesses } from 'src/redux/slices/business';
import { useDispatch, useSelector } from 'src/redux/store';
import { IAuditor } from 'src/types/auditor';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  company: '';
}

type Props = {
  currentUser?: IAuditor;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const businesses = useSelector((state) => state.business.businesses);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  useEffect(() => {}, []);
  const resolver = {
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
  };
  const resolverCurren = {
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    company: Yup.string().required('Company is required'),
  };
  const NewUserSchema = Yup.object().shape(currentUser ? resolverCurren : resolver);
  useEffect(() => {
    if (currentUser) {
      dispatch(getBusinesses());
    }
  }, [currentUser]);
  // useEffect(() => {
  //   const token = sessionStorage.getItem('token');
  //   const accessToken: string = `Bearer ${token}`;

  //   console.log('user', currentUser);
  //   const headersList = {
  //     accept: '*/*',
  //     Authorization: accessToken,
  //   };
  //   const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.users.detail}${currentUser?.firebaseUserId}`;

  //   axios
  //     .get(url, {
  //       headers: headersList,
  //     })
  //     .then((resp) => {})
  //     .catch((e) => {
  //       console.log('e', e);
  //     });
  // }, []);
  const defaultNoCurr = {
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    password: currentUser?.password || '',
    role: currentUser?.roleName || 'AUDITOR',
  };
  const defaultVlCurr = {
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    password: currentUser?.password || '',
    role: currentUser?.roleName || 'AUDITOR',
    company: '',
  };
  const defaultValues = useMemo(
    () => (!currentUser ? defaultNoCurr : defaultVlCurr),
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
      if (!currentUser) {
        try {
          setError(false);
          data.role = 'AUDITOR';
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
      } else {
        try {
          const selectedBusinessID = JSON.parse(sessionStorage.getItem('selectedBusinessID') ?? '');
          const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors`;
          const date = new Date().toUTCString;
          const param = {
            version: currentUser.version,
            businessId: selectedBusinessID.businessId,
            userId: currentUser.firebaseUserId,
            password: currentUser.password,
            expiredDate: date,
          };
          axios.post(url, param);
        } catch (e) {
          console.log('error', e);
        }
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

  return (
    // <>
    //   {openPop && <BusinessPicker />}
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={10} md={2}>
          {/* <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card> */}
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {!currentUser ? 'Thêm Kiểm Duyệt viên' : 'Chỉnh sửa kiểm duyệt viên'}
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
              <RHFTextField name="fullName" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField disabled name="role" label="Role" value="Kiểm duyệt viên" />
              {!currentUser ? (
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
              ) : (
                <RHFAutocomplete
                  name="company"
                  label="Công ty"
                  options={businesses.allIds.map((businessId) => businesses.byId[businessId].name)}
                  getOptionLabel={(option) => option.toString()}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => {
                    return <li {...props}>{option}</li>;
                  }}
                />
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Thêm' : 'Lưu'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    // </>
  );
}
