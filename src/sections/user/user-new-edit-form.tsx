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
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  businessId: string;
  expiredDate: string;
  password: string;
}

type Props = {
  currentUser?: IAuditor;
  isView?: boolean;
};

export default function UserNewEditForm({ currentUser, isView }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const DEFAULT_DATE = new Date();
  const defaultBizForAuditor = [
    {
      id: '',
      createdAt: '',
      modifiedAt: '',
      version: null,
      name: '',
      address: '',
      website: null,
      taxNumber: null,
      email: '',
      logo: null,
      invoiceReceivedEmail: '',
      engName: null,
    },
  ];
  const [defaultBizAud, setDefaultBizAud] = useState(defaultBizForAuditor);
  const loadBizForAuditor = async () => {
    // const response = await axios.get(),
  };
  useEffect(() => {
    dispatch(getBusinesses());
    if (currentUser?.roleName === 'Kiểm duyệt viên' && isView) {
      loadBizForAuditor();
    }
  }, []);
  const businesses = useSelector((state) => state.business.businesses);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [date, setDate] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const resolver = {
    userFullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
  };
  const resolverCurren = {
    userFullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    businessId: Yup.string().required('Company is required'),
  };
  const NewUserSchema = Yup.object().shape(currentUser ? resolverCurren : resolver);

  const defaultNoCurr = {
    userFullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'Kiểm duyệt viên',
  };
  const defaultVlCurr = {
    userFullName: currentUser?.userFullName || '',
    email: currentUser?.email || '',
    phoneNumber: `0${currentUser?.phoneNumber.substring(3)}` || '',
    password: '',
    role: currentUser?.roleName || 'Kiểm duyệt viên',
    businessId: '',
  };
  const defaultValues = useMemo(
    () => (!currentUser ? defaultNoCurr : defaultVlCurr),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const handleChangeDate = (value: Date) => {
    setDate(value);
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
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      if (!currentUser) {
        try {
          setError(false);
          data.role = 'AUDITOR';
          data.phoneNumber = `+84${data.phoneNumber.substring(1)}`;
          const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/auth`;
          const response = await axios.post(
            url,
            {},
            {
              headers: headersList,
              params: data,
            }
          );
          if (response.status === 200) {
            enqueueSnackbar('Thêm thành công');
            router.push(paths.dashboard.user.list);
          } else {
            setErrorMsg('Thêm thất bại');
            setError(true);
          }
        } catch (e) {
          reset();
          setErrorMsg('Thêm thất bại');
          setError(true);
        }
      } else {
        try {
          if (
            date?.getDate() === DEFAULT_DATE.getDate() &&
            date?.getMonth() === DEFAULT_DATE.getMonth() &&
            date?.getFullYear() === DEFAULT_DATE.getFullYear()
          ) {
            setErrorMsg('Vui lòng chọn ngày sau hôm nay');
            setError(true);
          } else {
            const bizLst = businesses.allIds.map((businessId) => businesses.byId[businessId]);
            const bizId = bizLst.filter((item) => item.name.localeCompare(data.businessId) === 0);
            data.businessId = bizId[0].id;
            const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors`;
            const param = {
              version: 0,
              businessId: data.businessId,
              userId: currentUser.id,
              password: data.password,
              expiredDate: date.toISOString(),
            };
            const response = await axios.post(url, param, {
              headers: headersList,
            });
            if (response.status === 200) {
              reset();
              enqueueSnackbar('Cập nhật thành công');
              router.push(paths.dashboard.user.list);
            } else {
              setErrorMsg('Cập nhật thất bại');
              setError(true);
            }
          }
        } catch (e) {
          reset();
          setErrorMsg('Cập nhật thất bại');
          setError(true);
        }
      }
    },
    [currentUser, enqueueSnackbar, reset, router, date]
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
          {/* <></> */}
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
              <RHFTextField disabled={!!currentUser} name="userFullName" label="Họ Tên" />
              <RHFTextField disabled={!!currentUser} name="email" label="Email" />
              <RHFTextField disabled={!!currentUser} name="phoneNumber" label="Số điện thoại" />
              <RHFTextField disabled name="role" label="Chức vụ" />
              {!isView && (
                <RHFTextField
                  name="password"
                  label="Mật khẩu"
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
              )}
              {currentUser && !isView && (
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
                  {/* <DateCalendar
                    defaultValue={new Date()}
                    onChange={(value) => handleChangeDate(value)}
                    disablePast
                  /> */}
                  <DatePicker
                    defaultValue={new Date()}
                    value={date}
                    onChange={(value) => setDate(value ?? new Date())}
                    disablePast
                    closeOnSelect
                    label="Ngày kết thúc hợp đồng"
                  />
                </>
              )}
            </Box>
            {!isView && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Thêm' : 'Lưu'}
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    // </>
  );
}
