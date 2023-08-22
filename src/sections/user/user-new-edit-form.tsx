import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

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
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { getBusinesses } from 'src/redux/slices/business';
import { useDispatch, useSelector } from 'src/redux/store';
import { IAuditor } from 'src/types/auditor';
import { IBusiness } from 'src/types/business';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import { Container } from '@mui/system';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  businessId: string;
  expiredDate: string;
  password: string;
  auditorBiz: string;
}

type Props = {
  currentUser?: IAuditor;
  isView?: boolean;
};

export default function UserNewEditForm({ currentUser, isView }: Props) {
  const router = useRouter();
  const confirm = useBoolean();
  const dispatch = useDispatch();
  const DEFAULT_DATE = new Date();
  const defaultBizForAuditor = [
    {
      id: '',
      createdAt: '',
      modifiedAt: '',
      version: 0,
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

  const businesses = useSelector((state) => state.business.businesses);
  const [error, setError] = useState(false);
  const [deleteComp, setDeleteComp] = useState('');
  const [onLoad, setOnload] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [date, setDate] = useState(new Date());
  const [bizDelete, setBizDelete] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const resolver = {
    userFullName: Yup.string().required('Vui lòng nhập họ tên'),
    email: Yup.string().required('Vui lòng nhập email').email('Vui lòng nhập email hợp lệ'),
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  };
  const loadBizForAuditor = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/businesses/${currentUser?.id}`,
        {
          headers: headersList,
        }
      );
      if (response.status === 200) {
        setDefaultBizAud(response.data);
      }
    } catch (e) {
      console.log('error', e);
      router.push(paths.dashboard.user.list);
    }
  };
  useEffect(() => {
    dispatch(getBusinesses());
    if (currentUser?.roleName === 'Kiểm duyệt viên') {
      loadBizForAuditor();
    }
  }, []);
  const resolverCurren = {
    userFullName: Yup.string().required('Vui lòng nhập họ tên'),
    email: Yup.string().required('Vui lòng nhập email').email('Vui lòng nhập email hợp lệ'),
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
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
          console.log('Data', data);
          const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/auth`;
          const response = await axios.post(url, data, {
            headers: headersList,
          });
          if (response.status === 201) {
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
          const bizLst = businesses.allIds.map((businessId) => businesses.byId[businessId]);
          if (
            date?.getDate() === DEFAULT_DATE.getDate() &&
            date?.getMonth() === DEFAULT_DATE.getMonth() &&
            date?.getFullYear() === DEFAULT_DATE.getFullYear()
          ) {
            setErrorMsg('Vui lòng chọn ngày sau hôm nay');
            setError(true);
          } else {
            setError(false);
            const bizId = bizLst.filter((item) => item.name.localeCompare(data.businessId) === 0);
            data.businessId = bizId[0].id;
            const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors`;
            const param = {
              version: 0,
              businessId: data.businessId,
              auditorId: currentUser.id,
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
  const handleConfirmDeleteComp = (name: string | null) => {
    const bizLst = defaultBizAud.filter((item) => item.name === name);
    setBizDelete(bizLst[0].id);
    setDeleteComp(name ?? '');
    confirm.onTrue();
  };
  const handleDeleteComp = async () => {
    const token = sessionStorage.getItem('token');
    const accessToken: string = `Bearer ${token}`;
    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };
    setOnload(true);
    try {
      const req = {
        version: 0,
        auditorId: Number(currentUser?.id),
        businessId: Number(bizDelete),
        password: '',
        expiredDate: '',
      };
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors`,
        {
          data: req,
          headers: headersList,
        }
      );
      if (response.status === 200) {
        const newList = defaultBizAud.filter((item) => item.id !== bizDelete);
        setDefaultBizAud(newList);
        enqueueSnackbar('Hủy quyền truy cập thành công');
        setOnload(false);
        router.refresh();
        confirm.onFalse();
      }
    } catch (e) {
      setOnload(false);
      setError(true);
      setErrorMsg('Hủy thất bại');
      confirm.onFalse();
    }
  };
  const headerText = () => {
    if (isView) {
      return `Thông tin ${currentUser?.roleName}`;
    }
    if (!currentUser) {
      return 'Thêm kiểm duyệt viên';
    }
    return 'Đăng ký kiểm duyệt viên';
  };
  return (
    <>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Hủy quyền truy cập"
        content={`Hủy quyền truy cập của ${currentUser?.userFullName} vào công ty ${deleteComp}`}
        action={
          <LoadingButton
            loading={onLoad}
            onClick={handleDeleteComp}
            variant="contained"
            color="error"
          >
            Hủy quyền truy cập
          </LoadingButton>
        }
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={10} md={2}>
            {/* <></> */}
          </Grid>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {headerText()}
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
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!currentUser}
                  name="userFullName"
                  label="Họ Tên"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!currentUser}
                  name="email"
                  label="Email"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!currentUser}
                  name="phoneNumber"
                  label="Số điện thoại"
                />
                <RHFTextField sx={{ fontWeight: 'bold' }} disabled name="role" label="Chức vụ" />

                {!isView && (
                  <RHFTextField
                    sx={{ fontWeight: 'bold' }}
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
                      sx={{ fontWeight: 'bold' }}
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
                      value={date}
                      onChange={(value) => setDate(value ?? new Date())}
                      disablePast
                      closeOnSelect
                      label="Ngày kết thúc hợp đồng"
                    />
                  </>
                )}
                {currentUser?.roleName === 'Kiểm duyệt viên' &&
                  isView &&
                  defaultBizAud.length >= 1 &&
                  defaultBizAud[0] !== defaultBizForAuditor[0] && (
                    <Stack sx={{ display: 'flex' }}>
                      <Typography variant="h5" sx={{ mt: 2, flexGrow: 1 }}>
                        Công ty đã đăng ký
                      </Typography>
                      <List>
                        {defaultBizAud.map((item) => (
                          <ListItem disablePadding>
                            <Iconify width={33} icon="mdi:dot" />
                            <ListItemText secondary={` ${item.name}`} />
                            <ListItemButton
                              sx={{ maxWidth: 50, maxHeight: 50 }}
                              onClick={() => handleConfirmDeleteComp(item.name)}
                            >
                              <Iconify
                                width={50}
                                height={100}
                                color="red"
                                icon="solar:trash-bin-trash-bold"
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  )}
                {currentUser?.roleName === 'Kiểm duyệt viên' &&
                  isView &&
                  defaultBizAud.length < 1 && (
                    <Stack sx={{ display: 'flex' }}>
                      <Typography variant="h5" sx={{ mt: 2, flexGrow: 1 }}>
                        Chưa đăng ký công ty
                      </Typography>
                    </Stack>
                  )}
              </Box>
              <Stack
                direction="row-reverse"
                spacing={2}
                alignItems="end"
                alignContent="end"
                sx={{ mt: 3 }}
              >
                {!isView && (
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentUser ? 'Thêm' : 'Lưu'}
                  </LoadingButton>
                )}
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  variant="contained"
                  color="error"
                >
                  Quay về
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
