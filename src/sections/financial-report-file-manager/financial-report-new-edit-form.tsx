import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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
import { IFinancialFileInfo } from 'src/types/report';

// ----------------------------------------------------------------------

interface FormValuesProps {
  year: number | string;
  quarter: string;
  FINANCIAL_BCDKT: CustomFile | null;
  FINANCIAL_BLCTT: CustomFile | null;
  FINANCIAL_BKQKD: CustomFile | null;
  FINANCIAL_BCDPSTK: CustomFile | null;
  FINANCIAL_SCT: CustomFile | null;
  FINANCIAL_TAX_FINALIZATION_TNCN: CustomFile | null;
  FINANCIAL_TAX_FINALIZATION_TNDN: CustomFile | null;
  FINANCIAL_STATEMENT_FOOTNOTES: CustomFile | null;
}

type Props = {
  year?: number | string;
  quarter?: string;
  FINANCIAL_BCDKT?: CustomFile | string | any;
  FINANCIAL_BLCTT?: CustomFile | string | any;
  FINANCIAL_BKQKD?: CustomFile | string | any;
  FINANCIAL_BCDPSTK?: CustomFile | string | any;
  FINANCIAL_SCT?: CustomFile | string | any;
  FINANCIAL_TAX_FINALIZATION_TNCN?: CustomFile | string | any;
  FINANCIAL_TAX_FINALIZATION_TNDN?: CustomFile | string | any;
  FINANCIAL_STATEMENT_FOOTNOTES?: CustomFile | string | any;
};

interface ReportFilesInfo {
  emailAddress: string;
  businessId: number;
  messageType: string;
  taxFileInfoList: [];
  financialFileInfoList: IFinancialFileInfo[];
}

export default function FinancialReportNewEditForm(props?: Props) {
  const router = useRouter();

  const [financialReportFiles, setFinancialReportFiles] = useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewFinancialReportSchema = Yup.object().shape({
    year: Yup.string().required('Năm là bắt buộc'),
    quarter: Yup.string().required('Quý là bắt buộc'),
    FINANCIAL_BCDKT: Yup.string().required('Bảng cân đối kế toán là bắt buộc'),
    FINANCIAL_BLCTT: Yup.string().required('Bảng lưu chuyển tiền tệ là bắt buộc'),
    FINANCIAL_BKQKD: Yup.string().required('Bảng kết quả kinh doanh là bắt buộc'),
    FINANCIAL_BCDPSTK: Yup.string().required('Bảng cân đối phát sinh tài khoản là bắt buộc'),
    FINANCIAL_SCT: Yup.string().required('Sổ chi tiết là bắt buộc'),
    FINANCIAL_TAX_FINALIZATION_TNCN: Yup.string().required(
      'FINANCIAL_TAX_FINALIZATION_TNCN là bắt buộc'
    ),
    FINANCIAL_TAX_FINALIZATION_TNDN: Yup.string().required(
      'Quyết toán thuế thu nhập cá nhân là bắt buộc'
    ),
    FINANCIAL_STATEMENT_FOOTNOTES: Yup.string().required(
      'Thuyết minh báo cáo tài chính là bắt buộc'
    ),
  });

  const defaultValues = useMemo(
    () => ({
      year: props?.year || '',
      quarter: props?.quarter || '',
      FINANCIAL_BCDKT: props?.FINANCIAL_BCDKT || {},
      FINANCIAL_BLCTT: props?.FINANCIAL_BLCTT || '',
      FINANCIAL_BKQKD: props?.FINANCIAL_BKQKD || '',
      FINANCIAL_BCDPSTK: props?.FINANCIAL_BCDPSTK || {},
      FINANCIAL_SCT: props?.FINANCIAL_SCT || '',
      FINANCIAL_TAX_FINALIZATION_TNCN: props?.FINANCIAL_TAX_FINALIZATION_TNCN || '',
      FINANCIAL_TAX_FINALIZATION_TNDN: props?.FINANCIAL_TAX_FINALIZATION_TNDN || '',
      FINANCIAL_STATEMENT_FOOTNOTES: props?.FINANCIAL_STATEMENT_FOOTNOTES || '',
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
    financialReportFiles.map((file: any) => {
      result.financialFileInfoList.push({
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
        financialReportFiles.map((file) => {
          dataApi.append('financialFiles', file.file);
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
        router.push(paths.dashboard.file.financial.root);
        console.info('DATA', data);
        console.log('NghiaLog: financialReportFiles - ', financialReportFiles);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, router, financialReportFiles]
  );

  useEffect(() => {
    console.log('NghiaLog: financialReportFiles - ', financialReportFiles);
  }, [financialReportFiles]);

  const handleDropFINANCIAL_BCDKT = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_BCDKT', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({
            reportType: 'FINANCIAL_BCDKT',
            file: newFile,
          })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_BKQKD = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_BKQKD', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({ reportType: 'FINANCIAL_BKQKD', file: newFile })
        );
      }
    },
    [setValue]
  );

  const handleDropFINANCIAL_BCDPSTK = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_BCDPSTK', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({ reportType: 'FINANCIAL_BCDPSTK', file: newFile })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_BLCTT = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_BLCTT', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({ reportType: 'FINANCIAL_BLCTT', file: newFile })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_SCT = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_SCT', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({ reportType: 'FINANCIAL_SCT', file: newFile })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_STATEMENT_FOOTNOTES = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_STATEMENT_FOOTNOTES', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({ reportType: 'FINANCIAL_STATEMENT_FOOTNOTES', file: newFile })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_TAX_FINALIZATION_TNCN = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_TAX_FINALIZATION_TNCN', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({
            reportType: 'FINANCIAL_TAX_FINALIZATION_TNCN',
            file: newFile,
          })
        );
      }
    },
    [setValue]
  );
  const handleDropFINANCIAL_TAX_FINALIZATION_TNDN = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('FINANCIAL_TAX_FINALIZATION_TNDN', newFile, { shouldValidate: true });
        setFinancialReportFiles((prevState) =>
          prevState.concat({
            reportType: 'FINANCIAL_TAX_FINALIZATION_TNDN',
            file: newFile,
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('FINANCIAL_BCDKT', null);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <Grid container> */}
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

      {/* <Grid> */}
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
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(_props, option) => <li {..._props}>{option}</li>}
          />
          <RHFAutocomplete
            name="quarter"
            label="Quý"
            options={['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => quarter)}
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(_props, option) => <li {..._props}>{option}</li>}
          />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Bảng cân đối phát sinh tài khoản</Typography>
            <RHFUploadBox
              name="FINANCIAL_BCDPSTK"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_BCDPSTK}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Bảng cân đối kế toán</Typography>
            <RHFUploadBox
              name="FINANCIAL_BCDKT"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_BCDKT}
              onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Bảng kết quả kinh doanh</Typography>
            <RHFUploadBox
              name="FINANCIAL_BKQKD"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_BKQKD}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Bảng lưu chuyển tiền tệ</Typography>
            <RHFUploadBox
              name="FINANCIAL_BLCTT"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_BLCTT}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Sổ chi tiết</Typography>
            <RHFUploadBox
              name="FINANCIAL_SCT"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_SCT}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Thuyết minh báo cáo tài chính</Typography>
            <RHFUploadBox
              name="FINANCIAL_STATEMENT_FOOTNOTES"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_STATEMENT_FOOTNOTES}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Quyết toán thuế thu nhập cá nhân</Typography>
            <RHFUploadBox
              name="FINANCIAL_TAX_FINALIZATION_TNCN"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_TAX_FINALIZATION_TNCN}
              //   onDelete={handleRemoveFile}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Quyết toán thuế thu nhập doanh nghiệp</Typography>
            <RHFUploadBox
              name="FINANCIAL_TAX_FINALIZATION_TNDN"
              maxSize={3145728}
              onDrop={handleDropFINANCIAL_TAX_FINALIZATION_TNDN}
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
      {/* </Grid> */}
      {/* </Grid> */}
    </FormProvider>
  );
}