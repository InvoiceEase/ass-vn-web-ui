import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
// utils
// assets
import { countries } from 'src/assets/data';
// types
import { IUserAccount } from 'src/types/profile';
// components
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

type FormValuesProps = IUserAccount;

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state) => state.profile.profileData);

  console.log('NghiaLog: user - ', user);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Business name is required'),
    address: Yup.string().required('Address is required'),
    taxNumber: Yup.string().required('Tax code is required'),
    businessTypeId: Yup.string().required('Business type is required'),
    representPersonName: Yup.string().required('Representative name is required'),
    invoiceReceivedEmail: Yup.string().required('Invoice received mail is required'),
    domainBusinessId: Yup.string().required('Tax declaration type is required'),
  });

  const defaultValues: IUserAccount = {
    name: user?.name || '',
    address: user?.address || '',
    taxNumber: user?.taxNumber || '',
    businessTypeId: user?.businessTypeId || 0,
    representPersonName: user?.representPersonName || '',
    invoiceReceivedEmail: user?.invoiceReceivedEmail || '',
    declarationPeriod: user?.declarationPeriod || 3,
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          <Card sx={{ p: 3 }}>
            <h2>Hãy cho chúng tôi biết thêm về doanh nghiệp của bạn</h2>
            <h4>Giúp chúng tôi hỗ trợ bạn tốt nhất có thể</h4>
            <Box rowGap={3} columnGap={2} display="grid">
              <RHFTextField name="name" label="Tên công ty" />
              <RHFTextField name="address" label="Địa chỉ" />
              <RHFTextField name="taxNumber" label="Mã số thuế" />

              <RHFAutocomplete
                name="businessTypeId"
                label="Loại hình DN"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />

              <RHFTextField name="representPersonName" label="Tên người đại diện" />
              <RHFTextField name="invoiceReceivedEmail" label="Mail nhận hoá đơn" />
              <RHFAutocomplete
                name="declarationPeriod"
                label="Khai báo thuế theo"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />
            </Box>

            {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
