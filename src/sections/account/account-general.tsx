import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
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
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { getBusinessTypes } from 'src/redux/slices/business';
import { useDispatch, useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

type FormValuesProps = IUserAccount;

export default function AccountGeneral() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state) => state.profile.profileData);

  const businessTypes = useSelector((state) => state.business.businessTypes);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Business name is required'),
    address: Yup.string().required('Address is required'),
    taxNumber: Yup.string().required('Tax code is required'),
    businessTypeId: Yup.string().required('Business type is required'),
    representPersonName: Yup.string().required('Representative name is required'),
    invoiceReceivedEmail: Yup.string().required('Invoice received mail is required'),
    domainBusinessId: Yup.string().required('Tax declaration type is required'),
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
              />

              <RHFTextField name="representPersonName" label="Tên người đại diện" />
              <RHFTextField name="invoiceReceivedEmail" label="Mail nhận hoá đơn" />
              <RHFAutocomplete
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
