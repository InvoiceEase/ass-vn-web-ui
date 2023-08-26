import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
// utils
// assets
import { periodDeclarationTypes } from 'src/assets/data';
// types
import { IUserAccount } from 'src/types/profile';
// components
import { Autocomplete, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'src/components/snackbar';
import { getBusinessTypes } from 'src/redux/slices/business';
import { updateUserData } from 'src/redux/slices/profile';
import { useDispatch, useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

type FormValuesProps = IUserAccount;

export default function AccountGeneral() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state) => state.profile.profileData);

  const newUser = useSelector((state) => state.profile.newProfileData);

  const formStep = useSelector((state) => state.profile.profileFormStep);

  const isUpdateSuccess = useSelector((state) => state.profile.isUpdateSuccess);

  const businessTypes = useSelector((state) => state.business.businessTypes);

  const [digitalSignatureRegisDate, setDigitalSignatureRegisDate] = useState(new Date());
  const [digitalSignatureDueDate, setDigitalSignatureDueDate] = useState(new Date());

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Tên doanh nghiệp là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    taxNumber: Yup.string().required('Mã số thuế là bắt buộc'),
    businessTypeId: Yup.string().required('Loại hình doanh nghiệp là bắt buộc'),
    representPersonName: Yup.string().required('Tên người đại diện là bắt buộc'),
    invoiceReceivedEmail: Yup.string().required('Mail nhận hoá đơn là bắt buộc'),
    domainBusinessId: Yup.string().required('Kỳ khai báo thuế là bắt buộc'),
    digitalSignatureRegisDate: Yup.string().required('Ngày đăng ký chữ ký số là bắt buộc'),
    digitalSignatureDueDate: Yup.string().required('Ngày hết hạn chữ ký số là bắt buộc'),
  });

  const defaultValues = {
    name: user?.name || '',
    address: user?.address || '',
    taxNumber: user?.taxNumber || '',
    businessTypeId: +businessTypes.byId[user?.businessTypeId ?? 0]?.id || null,
    representPersonName: user?.representPersonName || '',
    invoiceReceivedEmail: user?.invoiceReceivedEmail || '',
    declarationPeriod:
      periodDeclarationTypes.filter((item) => item.id?.toString() === user?.declarationPeriod)[0]
        ?.label || null,
    digitalSignatureRegisDate: user?.digitalSignatureRegisDate || '',
    digitalSignatureDueDate: user?.digitalSignatureDueDate || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    dispatch(getBusinessTypes());
  }, []);

  return (
    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={3}>
      {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
          </Card>
        </Grid> */}

      <Grid xs={10}>
        {formStep === 0 || (formStep === 2 && isUpdateSuccess) ? (
          <Card sx={{ p: 3 }}>
            <h2>Hãy cho chúng tôi biết thêm về doanh nghiệp của bạn</h2>
            <h4>Giúp chúng tôi hỗ trợ bạn tốt nhất có thể</h4>
            <Box rowGap={3} columnGap={2} display="grid">
              {/* <RHFTextField name="name" label="Tên công ty" /> */}
              <TextField
                id="name"
                label="Tên công ty"
                variant="outlined"
                defaultValue={user?.name}
                value={newUser?.name}
                onChange={(e) => dispatch(updateUserData({ name: e.target.value }))}
              />
              {/* <RHFTextField name="address" label="Địa chỉ" /> */}
              <TextField
                id="address"
                label="Địa chỉ"
                variant="outlined"
                defaultValue={user?.address}
                value={newUser?.address}
                onChange={(e) => dispatch(updateUserData({ address: e.target.value }))}
              />
              {/* <RHFTextField name="taxNumber" label="Mã số thuế" /> */}
              <TextField
                id="taxNumber"
                label="Mã số thuế"
                variant="outlined"
                defaultValue={user?.taxNumber}
                inputProps={{ maxLength: 10 }}
                value={newUser?.taxNumber}
                onChange={(e) => dispatch(updateUserData({ taxNumber: e.target.value }))}
              />

              {/* <RHFAutocomplete
                name="businessTypeId"
                label="Loại hình DN"
                options={businessTypes.allIds.map((id) => businessTypes.byId[id].name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  if (!option) {
                    return null;
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
              /> */}
              <Autocomplete
                disablePortal
                id="businessTypeId"
                defaultValue={businessTypes.byId[user?.businessTypeId ?? '']?.name}
                value={businessTypes.byId[newUser?.businessTypeId ?? '']?.name}
                options={businessTypes.allIds.map((id) => businessTypes.byId[id].name)}
                renderInput={(params) => <TextField {...params} label="Loại hình DN" />}
                renderOption={(props, option) => {
                  if (!option) {
                    return null;
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
                onChange={(e, newValue) => {
                  let data: string;
                  businessTypes.allIds.forEach((id) => {
                    if (businessTypes.byId[id].name === newValue) {
                      data = id;
                      dispatch(updateUserData({ businessTypeId: data }));
                    }
                  });
                }}
              />

              {/* <RHFTextField name="representPersonName" label="Tên người đại diện" /> */}
              <TextField
                id="representPersonName"
                label="Tên người đại diện"
                variant="outlined"
                defaultValue={user?.representPersonName}
                value={newUser?.representPersonName}
                onChange={(e) => dispatch(updateUserData({ representPersonName: e.target.value }))}
              />
              {/* <RHFTextField name="invoiceReceivedEmail" label="Mail nhận hoá đơn" /> */}
              <TextField
                id="invoiceReceivedEmail"
                label="Mail nhận hoá đơn"
                variant="outlined"
                defaultValue={user?.invoiceReceivedEmail}
                value={newUser?.invoiceReceivedEmail}
                onChange={(e) => dispatch(updateUserData({ invoiceReceivedEmail: e.target.value }))}
              />
              {/* <RHFAutocomplete
                name="declarationPeriod"
                label="Khai báo thuế theo"
                options={periodDeclarationTypes.map((type) => type.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  if (!option) {
                    return null;
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
              /> */}
              <Autocomplete
                disablePortal
                id="declarationPeriod"
                defaultValue={user?.declarationPeriod}
                value={newUser?.declarationPeriod}
                // value={getPeriodDeclarationTypeLabel(newUser?.declarationPeriod ?? '')}
                options={periodDeclarationTypes.map((type) => type.label)}
                renderInput={(params) => (
                  <TextField {...params} label="Khai báo thuế theo (đơn vị tháng)" />
                )}
                renderOption={(props, option) => {
                  if (!option) {
                    return null;
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
                onChange={(e, newValue) => {
                  let data: number;
                  periodDeclarationTypes.forEach((item) => {
                    if (item.label === newValue) {
                      data = item.id;
                      dispatch(updateUserData({ declarationPeriod: data }));
                    }
                  });
                }}
              />
            </Box>

            {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack> */}
          </Card>
        ) : (
          <Card sx={{ p: 3 }}>
            <h2>Chữ ký số</h2>
            <Stack sx={{ flexDirection: 'row' }}>
              <DatePicker
                defaultValue={new Date(user?.digitalSignatureRegisDate ?? '')}
                value={new Date(newUser?.digitalSignatureRegisDate ?? '')}
                onChange={(value) =>
                  dispatch(updateUserData({ digitalSignatureRegisDate: value ?? new Date() }))
                }
                closeOnSelect
                label="Từ"
                sx={{ mr: 2 }}
              />
              <DatePicker
                defaultValue={new Date(user?.digitalSignatureDueDate ?? '')}
                value={new Date(newUser?.digitalSignatureDueDate ?? '')}
                onChange={(value) =>
                  dispatch(updateUserData({ digitalSignatureDueDate: value ?? new Date() }))
                }
                closeOnSelect
                label="Đến"
              />
            </Stack>
          </Card>
        )}
      </Grid>
    </Grid>
    // </FormProvider>
  );
}
