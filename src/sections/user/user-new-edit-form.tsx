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
import { IBusiness } from 'src/types/business';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  businessId: string;
  expiredDate: string;
  password: string;
}

type Props = {
  currentUser?: IAuditor;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBusinesses());
  }, []);
  const businesses = useSelector((state) => state.business.businesses);
  let bizChosen: IBusiness[] = [];
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [date, setDate] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
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
    password: Yup.string().required('Password is required'),
    businessId: Yup.string().required('Company is required'),
  };
  const NewUserSchema = Yup.object().shape(currentUser ? resolverCurren : resolver);

  useEffect(() => {
    bizChosen = businesses.allIds.map((businessId) => businesses.byId[businessId]);
  }, []);

  const defaultNoCurr = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'AUDITOR',
  };
  const defaultVlCurr = {
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phoneNumber: `0${currentUser?.phoneNumber.substring(3)}` || '',
    password: currentUser?.password || '',
    role: currentUser?.roleName || 'AUDITOR',
    businessId: '',
  };
  const defaultValues = useMemo(
    () => (!currentUser ? defaultNoCurr : defaultVlCurr),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const handleChangeDate = (value: Date | null) => {
    setDate(value ?? new Date());
  };
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
          debugger;
          const bizId = bizChosen.filter((item) => item.name.localeCompare(data.businessId) === 0);
          data.businessId = bizId[0].id;
          const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors`;
          const param = {
            version: 0,
            businessId: data.businessId,
            userId: currentUser.id,
            password: data.password,
            expiredDate: date.toISOString(),
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
              <RHFTextField disabled={!!currentUser} name="fullName" label="Name" />
              <RHFTextField disabled={!!currentUser} name="email" label="Email Address" />
              <RHFTextField disabled={!!currentUser} name="phoneNumber" label="Phone Number" />
              <RHFTextField disabled name="role" label="Role" value="Kiểm duyệt viên" />

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
              {currentUser && (
                <>
                  <RHFAutocomplete
                    name="businessId"
                    label="Công ty"
                    options={businesses.allIds.map(
                      (businessId) => businesses.byId[businessId].name
                    )}
                    getOptionLabel={(option) => option.toString()}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderOption={(props, option) => <li {...props}>{option}</li>}
                  />
                  <DatePicker
                    defaultValue={new Date()}
                    onChange={(value) => handleChangeDate(value)}
                  />
                </>
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
