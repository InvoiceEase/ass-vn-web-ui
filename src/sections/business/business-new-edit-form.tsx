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
import { IBusiness, IBusinessAdmin } from 'src/types/business';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import { Container } from '@mui/system';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
  businessId: string;
  expiredDate: string;
  password: string;
  auditorBiz: string;
  representPersonName: string;
  invoiceReceivedEmail: string;
  taxNumber: string;
  email: string;
  name: string;
}

type Props = {
  currentBiz?: IBusinessAdmin;
  isView?: boolean;
};

export default function BusinessNewEditForm({ currentBiz, isView }: Props) {
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
      userFullName: '',
      firebaseUserId: '',
      role: '',
      organizationId: '',
    },
  ];
  const [defaultBizAud, setDefaultBizAud] = useState(defaultBizForAuditor);

  const [error, setError] = useState(false);
  const [onLoad, setOnload] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [date, setDate] = useState(new Date());
  const [bizDelete, setBizDelete] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const resolver = {
    name: Yup.string().required('Vui lòng nhập tên doanh nghiệp'),
    email: Yup.string().required('Vui lòng nhập email').email('Vui lòng nhập email hợp lệ'),
    taxNumber: Yup.string().required('Vui lòng nhập mã số thuế'),
    invoiceReceivedEmail: Yup.string()
      .required('Vui lòng nhập email nhận hóa đơn')
      .email('Vui lòng nhập email hợp lệ'),
    representPersonName: Yup.string().required('Vui lòng nhập tên người đại diện'),
  };
  const defaultNoCurr = {
    id: currentBiz?.id || '',
    createdAt: currentBiz?.createdAt || '',
    modifiedAt: currentBiz?.modifiedAt || '',
    version: currentBiz?.version || 0,
    name: currentBiz?.name || '',
    address: currentBiz?.address || '',
    website: currentBiz?.website || '',
    taxNumber: currentBiz?.taxNumber || '',
    email: currentBiz?.email || '',
    logo: currentBiz?.logo || '',
    invoiceReceivedEmail: currentBiz?.invoiceReceivedEmail || currentBiz?.email,
    engName: currentBiz?.engName || '',
    representPersonName: currentBiz?.representPersonName || '',
    needAudit: currentBiz?.needAudit || true,
    digitalSignatureDueDate: currentBiz?.digitalSignatureDueDate || '',
    digitalSignaturePeriod: currentBiz?.digitalSignaturePeriod || 0,
    digitalSignatureRegisDate: currentBiz?.digitalSignatureRegisDate || '',
    declarationPeriod: currentBiz?.declarationPeriod || 0,
    businessTypeId: currentBiz?.businessTypeId || 0,
    domainBusinessId: currentBiz?.domainBusinessId || 0,
  };

  const loadAuditoForBiz = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/audits/auditors/${currentBiz?.id}`,
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
    if (currentBiz) {
      loadAuditoForBiz();
    }
  }, []);
  const resolverCurren = {
    name: Yup.string().required('Vui lòng nhập tên doanh nghiệp'),
    email: Yup.string().required('Vui lòng nhập email').email('Vui lòng nhập email hợp lệ'),
    taxNumber: Yup.string().required('Vui lòng nhập mã số thuế'),
    invoiceReceivedEmail: Yup.string()
      .required('Vui lòng nhập email nhận hóa đơn')
      .email('Vui lòng nhập email hợp lệ'),
    representPersonName: Yup.string().required('Vui lòng nhập tên người đại diện'),
  };
  const NewUserSchema = Yup.object().shape(currentBiz ? resolverCurren : resolver);

  const defaultValues = useMemo(
    () => defaultNoCurr,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBiz]
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
      try {
        setError(false);
        const url = `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/businesses`;
        const response = await axios.put(
          url,
          {
            version: 0,
            name: data.name,
            address: data.address,
            website: currentBiz?.website || '',
            taxNumber: data.taxNumber,
            email: data.email,
            logo: currentBiz?.logo || '',
            invoiceReceivedEmail: data.invoiceReceivedEmail,
            engName: currentBiz?.engName || '',
            digitalSignatureDueDate: currentBiz?.digitalSignatureDueDate || '',
            digitalSignaturePeriod: currentBiz?.digitalSignaturePeriod || 0,
            digitalSignatureRegisDate: currentBiz?.digitalSignatureRegisDate || '',
            representPersonName: data.representPersonName || '',
            declarationPeriod: currentBiz?.declarationPeriod || 0,
            needAudit: true,
            businessTypeId: currentBiz?.businessTypeId || 0,
            domainBusinessId: currentBiz?.domainBusinessId || 0,
          },
          {
            data: { data },
            params: { id: data.id },
            headers: headersList,
          }
        );
        if (response.status === 200) {
          reset();
          enqueueSnackbar('Cập nhật thành công');
          router.push(paths.dashboard.user.list);
        } else {
          setErrorMsg('Cập nhật thất bại');
          setError(true);
        }
      } catch (e) {
        reset();
        setErrorMsg('Cập nhật thất bại');
        setError(true);
      }
    },
    [currentBiz, enqueueSnackbar, reset, router, date]
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
  // const handleConfirmDeleteComp = (name: string | null) => {
  //   const bizLst = defaultBizAud.filter((item) => item.name === name);
  //   setBizDelete(bizLst[0].id);
  //   setDeleteComp(name ?? '');
  //   confirm.onTrue();
  // };
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
        auditorId: Number(currentBiz?.id),
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
      return `Thông tin ${currentBiz?.name}`;
    }
    if (!currentBiz) {
      return 'Thêm doanh nghiệp';
    }
    return 'Chỉnh sửa doanh nghiệp';
  };
  return (
    <>
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Hủy quyền truy cập"
        content={`Hủy quyền truy cập của ${currentBiz?.nam} vào công ty ${deleteComp}`}
        action={
          <LoadingButton loading={onLoad} onClick={handleDeleteComp} variant="contained" color="error">
            Hủy quyền truy cập
          </LoadingButton>
        }
      /> */}
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
                  disabled={!!isView}
                  name="name"
                  label="Tên doanh nghiệp"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!isView}
                  name="email"
                  label="Email"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!isView}
                  name="taxNumber"
                  label="Mã số thuế"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!isView}
                  name="invoiceReceivedEmail"
                  label="Email nhận hóa đơn"
                />
                <RHFTextField
                  sx={{ fontWeight: 'bold' }}
                  disabled={!!isView}
                  name="representPersonName"
                  label="Người dại diện"
                />
              </Box>
              {isView &&
                defaultBizAud.length >= 1 &&
                defaultBizAud[0] !== defaultBizForAuditor[0] && (
                  <Stack sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ mt: 2, flexGrow: 1 }}>
                      Kiểm duyệt viên đã được đăng ký
                    </Typography>
                    <List>
                      {defaultBizAud.map((item) => (
                        <ListItem disablePadding>
                          <Iconify width={33} icon="mdi:dot" />
                          <ListItemText secondary={` ${item.userFullName}`} />
                          {/* <ListItemButton
                              sx={{ maxWidth: 50, maxHeight: 50 }}
                              onClick={() => handleConfirmDeleteComp(item.name)}
                            >
                              <Iconify
                                width={50}
                                height={100}
                                color="red"
                                icon="solar:trash-bin-trash-bold"
                              />
                            </ListItemButton> */}
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                )}
              {isView && defaultBizAud.length < 1 && (
                <Stack sx={{ display: 'flex' }}>
                  <Typography variant="h5" sx={{ mt: 2, flexGrow: 1 }}>
                    Chưa có kiểm duyệt viên
                  </Typography>
                </Stack>
              )}
              <Stack
                direction="row-reverse"
                spacing={2}
                alignItems="end"
                alignContent="end"
                sx={{ mt: 3 }}
              >
                {!isView && (
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentBiz ? 'Thêm' : 'Lưu'}
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
