import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// routes
// _mock
// types
// assets
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { getProviders, updateProvider } from 'src/redux/slices/provider';
import { useDispatch } from 'src/redux/store';
import { IProvider } from 'src/types/provider';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IProvider, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentProvider: IProvider;
};

export default function ProviderQuickEditForm({ currentProvider, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewProviderSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    taxNumber1: Yup.string().required('Tax Number is required'),
  });

  const defaultValues = {
    name: currentProvider?.name || '',
    email: currentProvider?.email || '',
    phoneNumber: currentProvider?.phoneNumber || '',
    address: currentProvider?.address || '',
    taxNumber1: currentProvider?.taxNumber || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProviderSchema),
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
        await dispatch(updateProvider(currentProvider?.id, currentProvider?.version, data));
        await dispatch(getProviders());
        reset();
        onClose();
        enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset]
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Box
            sx={{ pt: 4 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {/* <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect> */}

            <RHFTextField name="taxNumber" label="Tax Number" />
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="phoneNumber" label="Phone Number" />

            {/* <RHFAutocomplete
              name="country"
              label="Country"
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

            <RHFTextField name="state" label="State/Region" />
            <RHFTextField name="city" label="City" /> */}
            <RHFTextField name="address" label="Address" />
            {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            {/* <RHFTextField name="company" label="Company" /> */}
            {/* <RHFTextField name="role" label="Role" /> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
