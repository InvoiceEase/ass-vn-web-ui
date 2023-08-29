import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo, useState } from 'react';
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
import { Divider, Typography } from '@mui/material';
import axios from 'axios';
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import FormProvider, { RHFAutocomplete, RHFUploadBox } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { useSelector } from 'src/redux/store';
import { IFinancialFileInfo, ITaxFileInfo } from 'src/types/report';
import { ITaxFile } from 'src/types/tax';

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
  files?: ITaxFile[];
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

  const taxReportFilesInRedux = useSelector((state) => state.tax.files);

  const [taxReportFiles, setTaxReportFiles] = useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewFinancialReportSchema = Yup.object().shape({
    year: Yup.string().required('Năm là bắt buộc'),
    quarter: Yup.string().required('Quý là bắt buộc'),
    TAX_RETURN_TNCN: !props?.year
      ? Yup.string().required('Tờ khai thuế thu nhập cá nhân is required')
      : Yup.string().notRequired(),
    TAX_RETURN_GTGT: !props?.year
      ? Yup.string().required('Tờ khai thuế giá trị gia tăng is required')
      : Yup.string().notRequired(),
    TAX_OUTCOME: !props?.year
      ? Yup.string().required('Bảng kê đầu ra is required')
      : Yup.string().notRequired(),
    TAX_INCOME: !props?.year
      ? Yup.string().required('Bảng kê đầu vào is required')
      : Yup.string().notRequired(),
  });

  const defaultValues = useMemo(
    () => ({
      year: props?.year || '',
      quarter: props?.quarter || '',
      TAX_RETURN_TNCN: props?.TAX_RETURN_TNCN || '',
      TAX_RETURN_GTGT: props?.TAX_RETURN_GTGT || '',
      TAX_OUTCOME: props?.TAX_OUTCOME || '',
      TAX_INCOME: props?.TAX_INCOME || '',
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
  const selectedBusinessId = sessionStorage.getItem('selectedBusinessID') ?? '0';
  const roleCode = sessionStorage.getItem('roleCode') ?? '';

  const getReportsByYearAndQuarter = (
    year: string | number | undefined,
    quarter: string | undefined
  ) => {
    const result = taxReportFilesInRedux.filter(
      (file) => file.year === year && file.quarter === quarter
    );
    return result;
  };

  const getReportFileIdInRedux = (reportType: string) => {
    const reports = getReportsByYearAndQuarter(props?.year, props?.quarter);
    const report = reports.filter((item) => item.reportType === reportType)[0];
    return report.id;
  };

  const mapDataReportFilesInfo = (dataForm: FormValuesProps) => {
    const year = dataForm.year ? +dataForm.year : 0;
    const quarter = dataForm.quarter ? +dataForm.quarter : 0;
    const result: ReportFilesInfo = {
      emailAddress,
      businessId: roleCode.includes(RoleCodeEnum.Manager) ? +businessId : +selectedBusinessId,
      messageType: props?.year ? 'UPDATE_REPORT' : 'UPLOAD_REPORT',
      taxFileInfoList: [],
      financialFileInfoList: [],
    };
    taxReportFiles.map((file: any) => {
      result.taxFileInfoList.push({
        year,
        quarter,
        reportType: file.reportType,
        fileName: file.file.name,
        currentReportFileId: props?.year ? getReportFileIdInRedux(file.reportType) : '',
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
        if (response.status === 200) {
          reset();
          enqueueSnackbar('Tải lên thành công!');
          router.push(paths.dashboard.file.tax.root);
        } else {
          enqueueSnackbar('Tải lên thất bại!', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Tải lên thất bại!', { variant: 'error' });
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, router, taxReportFiles]
  );

  const handleDropTAX_RETURN_TNCN = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('TAX_RETURN_TNCN', newFile, { shouldValidate: true });
        setTaxReportFiles((prevState) => {
          const indexOfChangeFile = prevState.findIndex(
            (item) => item.reportType === 'TAX_RETURN_TNCN'
          );
          if (indexOfChangeFile !== -1) {
            prevState.splice(indexOfChangeFile, 1);
            const newState = [
              ...prevState,
              (prevState[indexOfChangeFile] = {
                reportType: 'TAX_RETURN_TNCN',
                file: newFile,
              }),
            ];
            return newState;
          }
          return prevState.concat({ reportType: 'TAX_RETURN_TNCN', file: newFile });
        });
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
        setTaxReportFiles((prevState) => {
          const indexOfChangeFile = prevState.findIndex(
            (item) => item.reportType === 'TAX_RETURN_GTGT'
          );
          if (indexOfChangeFile !== -1) {
            prevState.splice(indexOfChangeFile, 1);
            const newState = [
              ...prevState,
              (prevState[indexOfChangeFile] = {
                reportType: 'TAX_RETURN_GTGT',
                file: newFile,
              }),
            ];
            return newState;
          }
          return prevState.concat({ reportType: 'TAX_RETURN_GTGT', file: newFile });
        });
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
        setTaxReportFiles((prevState) => {
          const indexOfChangeFile = prevState.findIndex(
            (item) => item.reportType === 'TAX_OUTCOME'
          );
          if (indexOfChangeFile !== -1) {
            prevState.splice(indexOfChangeFile, 1);
            const newState = [
              ...prevState,
              (prevState[indexOfChangeFile] = {
                reportType: 'TAX_OUTCOME',
                file: newFile,
              }),
            ];
            return newState;
          }
          return prevState.concat({ reportType: 'TAX_OUTCOME', file: newFile });
        });
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
        setTaxReportFiles((prevState) => {
          const indexOfChangeFile = prevState.findIndex((item) => item.reportType === 'TAX_INCOME');
          if (indexOfChangeFile !== -1) {
            prevState.splice(indexOfChangeFile, 1);
            const newState = [
              ...prevState,
              (prevState[indexOfChangeFile] = {
                reportType: 'TAX_INCOME',
                file: newFile,
              }),
            ];
            return newState;
          }
          return prevState.concat({ reportType: 'TAX_INCOME', file: newFile });
        });
      }
    },
    [setValue]
  );

  return (
    <>
      <Typography variant="h4" sx={{ mb: 6 }}>
        {props?.year ? 'Cập nhật Báo cáo thuế' : 'Tải lên Báo cáo thuế'}
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/* <Grid> */}
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
              disabled={!!props?.year}
              name="year"
              label="Năm"
              options={years.map((year) => year.toString())}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(_props, option) => <li {..._props}>{option}</li>}
            />
            <RHFAutocomplete
              disabled={!!props?.quarter}
              name="quarter"
              label="Quý"
              options={['1', '2', '3', '4'].map((year) => year.toString())}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(_props, option) => <li {..._props}>{option}</li>}
            />
            <Stack spacing={1.5}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle2">Tờ khai thuế thu nhập cá nhân</Typography>
              {props?.year && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FileThumbnail
                      sx={{ mr: 1 }}
                      file={
                        props?.files?.filter((file) => file.reportType === 'TAX_RETURN_TNCN')[0]
                          ?.fileExtension ?? ''
                      }
                    />
                    {`${
                      props?.files?.filter((file) => file.reportType === 'TAX_RETURN_TNCN')[0]
                        ?.fileName
                    }.${
                      props?.files?.filter((file) => file.reportType === 'TAX_RETURN_TNCN')[0]
                        ?.fileExtension
                    }`}
                  </Stack>
                  <Iconify icon="eva:arrow-down-fill" width={24} sx={{ mt: 1, mb: 1 }} />
                </Stack>
              )}
              <RHFUploadBox
                name="TAX_RETURN_TNCN"
                maxSize={3145728}
                accept={{
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  'application/pdf': [],
                }}
                onDrop={handleDropTAX_RETURN_TNCN}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle2">Tờ khai thuế giá trị gia tăng</Typography>
              {props?.year && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FileThumbnail
                      sx={{ mr: 1 }}
                      file={
                        props?.files?.filter((file) => file.reportType === 'TAX_RETURN_GTGT')[0]
                          ?.fileExtension ?? ''
                      }
                    />
                    {`${
                      props?.files?.filter((file) => file.reportType === 'TAX_RETURN_GTGT')[0]
                        ?.fileName
                    }.${
                      props?.files?.filter((file) => file.reportType === 'TAX_RETURN_GTGT')[0]
                        ?.fileExtension
                    }`}
                  </Stack>
                  <Iconify icon="eva:arrow-down-fill" width={24} sx={{ mt: 1, mb: 1 }} />
                </Stack>
              )}
              <RHFUploadBox
                name="TAX_RETURN_GTGT"
                maxSize={3145728}
                accept={{
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  'application/pdf': [],
                }}
                onDrop={handleDropTAX_RETURN_GTGT}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle2">Bảng kê đầu ra</Typography>
              {props?.year && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FileThumbnail
                      sx={{ mr: 1 }}
                      file={
                        props?.files?.filter((file) => file.reportType === 'TAX_OUTCOME')[0]
                          ?.fileExtension ?? ''
                      }
                    />
                    {`${
                      props?.files?.filter((file) => file.reportType === 'TAX_OUTCOME')[0]?.fileName
                    }.${
                      props?.files?.filter((file) => file.reportType === 'TAX_OUTCOME')[0]
                        ?.fileExtension
                    }`}
                  </Stack>
                  <Iconify icon="eva:arrow-down-fill" width={24} sx={{ mt: 1, mb: 1 }} />
                </Stack>
              )}
              <RHFUploadBox
                name="TAX_OUTCOME"
                maxSize={3145728}
                accept={{
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  'application/pdf': [],
                }}
                onDrop={handleDropTAX_OUTCOME}
                //   onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle2">Bảng kê đầu vào</Typography>
              {props?.year && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FileThumbnail
                      sx={{ mr: 1 }}
                      file={
                        props?.files?.filter((file) => file.reportType === 'TAX_INCOME')[0]
                          ?.fileExtension ?? ''
                      }
                    />
                    {`${
                      props?.files?.filter((file) => file.reportType === 'TAX_INCOME')[0]?.fileName
                    }.${
                      props?.files?.filter((file) => file.reportType === 'TAX_INCOME')[0]
                        ?.fileExtension
                    }`}
                  </Stack>
                  <Iconify icon="eva:arrow-down-fill" width={24} sx={{ mt: 1, mb: 1 }} />
                </Stack>
              )}
              <RHFUploadBox
                name="TAX_INCOME"
                maxSize={3145728}
                accept={{
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  'application/pdf': [],
                }}
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
        {/* </Grid> */}
        {/* </Grid> */}
      </FormProvider>
    </>
  );
}
