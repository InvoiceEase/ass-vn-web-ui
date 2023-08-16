import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// types
// assets
import { years } from 'src/assets/data';
// components
import { Typography } from '@mui/material';
import axios from 'axios';
import FormProvider, { RHFAutocomplete, RHFUploadBox } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { useSelector } from 'src/redux/store';
import { IFinancialFileInfo, ITaxFileInfo } from 'src/types/report';

// ----------------------------------------------------------------------

interface FormValuesProps {
  year: number | string;
  quarter: string;
  TAX_RETURN_TNCN: CustomFile | null;
  TAX_RETURN_GTGT: CustomFile | null;
  TAX_OUTCOME: CustomFile | null;
  TAX_INCOME: CustomFile | null;
}

type Props = {
  year?: number | string;
  quarter?: string;
  TAX_RETURN_TNCN?: CustomFile | string | any;
  TAX_RETURN_GTGT?: CustomFile | string | any;
  TAX_OUTCOME?: CustomFile | string | any;
  TAX_INCOME?: CustomFile | string | any;
};

interface ReportFilesInfo {
  emailAddress: string;
  businessId: number;
  messageType: string;
  taxFileInfoList: ITaxFileInfo[];
  financialFileInfoList: IFinancialFileInfo[];
}

export default function TaxReportNewEditForm(props?: Props) {
  const router = useRouter();

  const [taxReportFiles, setTaxReportFiles] = useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewFinancialReportSchema = Yup.object().shape({
    year: Yup.string().required('Năm là bắt buộc'),
    quarter: Yup.string().required('Quý là bắt buộc'),
    TAX_RETURN_TNCN: Yup.string().required('Tờ khai thuế thu nhập cá nhân is required'),
    TAX_RETURN_GTGT: Yup.string().required('Tờ khai thuế giá trị gia tăng is required'),
    TAX_OUTCOME: Yup.string().required('Bảng kê đầu ra is required'),
    TAX_INCOME: Yup.string().required('Bảng kê đầu vào is required'),
  });

  const defaultValues = useMemo(
    () => ({
      year: props?.year || '',
      quarter: props?.quarter || '',
      TAX_RETURN_TNCN: props?.TAX_RETURN_TNCN || {},
      TAX_RETURN_GTGT: props?.TAX_RETURN_GTGT || '',
      TAX_OUTCOME: props?.TAX_OUTCOME || '',
      TAX_INCOME: props?.TAX_INCOME || {},
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewFinancialReportSchema),
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

  const emailAddress = useSelector((state) => state.profile.profileData.email);
  const businessId = sessionStorage.getItem('orgId') ?? '0';

  const mapDataReportFilesInfo = (dataForm: FormValuesProps) => {
    const year = dataForm.year ? +dataForm.year : 0;
    const quarter = dataForm.quarter ? +dataForm.quarter.charAt(1) : 0;
    const result: ReportFilesInfo = {
      emailAddress,
      businessId: +businessId,
      messageType: 'UPLOAD',
      taxFileInfoList: [],
      financialFileInfoList: [],
    };
    taxReportFiles.map((file: any) => {
      result.taxFileInfoList.push({
        year,
        quarter,
        reportType: file.reportType,
        fileName: file.file.name,
        currentReportFileId: '',
      });
    });
    return result;
  };

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const dataApi = new FormData();
        // data.append(
        //   'taxFiles',
        //   fs.createReadStream('/C:/Users/Kyro/Downloads/HOADON_0316439932_1C23TMA_198.pdf')
        // );
        taxReportFiles.map((file) => {
          dataApi.append('taxFiles', file.file);
        });
        const reportFilesInfo = mapDataReportFilesInfo(data);
        const json = JSON.stringify(reportFilesInfo);
        const blob = new Blob([json], {
          type: 'application/json',
        });

        dataApi.append('reportFilesInfo', blob);

        // let config = {
        //   method: 'post',
        //   maxBodyLength: Infinity,
        //   url: 'https://us-central1-accountant-support-system.cloudfunctions.net/uploadReportFiles',
        //   headers: {
        //     ...data.getHeaders(),
        //   },
        //   data: data,
        // };

        // axios
        //   .request(config)
        //   .then((response) => {
        //     console.log(JSON.stringify(response.data));
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          headers: {
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'content-type': 'multipart/form-data',
          },
        };

        const response = await axios.post(
          'https://us-central1-accountant-support-system.cloudfunctions.net/uploadReportFiles',
          dataApi,
          config
        );
        reset();
        enqueueSnackbar('Tải lên thành công!');
        // enqueueSnackbar(currentFile ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.file.tax.root);
        console.info('DATA', data);
        console.log('NghiaLog: taxReportFiles - ', taxReportFiles);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, router, taxReportFiles]
  );

  useEffect(() => {
    console.log('NghiaLog: taxReportFiles - ', taxReportFiles);
  }, [taxReportFiles]);

  const handleDropTAX_RETURN_TNCN = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('TAX_RETURN_TNCN', newFile, { shouldValidate: true });
        setTaxReportFiles((prevState) =>
          prevState.concat({
            reportType: 'TAX_RETURN_TNCN',
            file: newFile,
          })
        );
      }
    },
    [setValue]
  );
  const handleDropTAX_RETURN_GTGT = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('TAX_RETURN_GTGT', newFile, { shouldValidate: true });
        setTaxReportFiles((prevState) =>
          prevState.concat({ reportType: 'TAX_RETURN_GTGT', file: newFile })
        );
      }
    },
    [setValue]
  );

  const handleDropTAX_OUTCOME = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('TAX_OUTCOME', newFile, { shouldValidate: true });
        setTaxReportFiles((prevState) =>
          prevState.concat({ reportType: 'TAX_OUTCOME', file: newFile })
        );
      }
    },
    [setValue]
  );
  const handleDropTAX_INCOME = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('TAX_INCOME', newFile, { shouldValidate: true });
        setTaxReportFiles((prevState) =>
          prevState.concat({ reportType: 'TAX_INCOME', file: newFile })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentFile && (
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

            {currentFile && (
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

            {currentFile && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid> */}

        {/* <Grid xs={12} md={8}> */}
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {/* <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" /> */}

            <RHFAutocomplete
              name="year"
              label="Năm"
              options={years.map((year) => year.toString())}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(_props, option) => <li {..._props}>{option}</li>}
            />
            <RHFAutocomplete
              name="quarter"
              label="Quý"
              options={['Q1', 'Q2', 'Q3', 'Q4'].map((year) => year.toString())}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(_props, option) => <li {..._props}>{option}</li>}
            />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Tờ khai thuế thu nhập cá nhân</Typography>
              <RHFUploadBox
                name="TAX_RETURN_TNCN"
                maxSize={3145728}
                onDrop={handleDropTAX_RETURN_TNCN}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Tờ khai thuế giá trị gia tăng</Typography>
              <RHFUploadBox
                name="TAX_RETURN_GTGT"
                maxSize={3145728}
                onDrop={handleDropTAX_RETURN_GTGT}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Bảng kê đầu ra</Typography>
              <RHFUploadBox
                name="TAX_OUTCOME"
                maxSize={3145728}
                onDrop={handleDropTAX_OUTCOME}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Bảng kê đầu vào</Typography>
              <RHFUploadBox
                name="TAX_INCOME"
                maxSize={3145728}
                onDrop={handleDropTAX_INCOME}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            {/* <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="role" label="Role" /> */}
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Tải lên
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
      {/* </Grid> */}
    </FormProvider>
  );
}