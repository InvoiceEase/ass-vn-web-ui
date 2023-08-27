'use client';

import { useCallback, useState } from 'react';
// @mui
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { getMails } from 'src/redux/slices/mail';
// routes
import { paths } from 'src/routes/paths';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import axios from 'axios';
import Iconify from 'src/components/iconify/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'src/components/snackbar';
import { Upload } from 'src/components/upload';
import { MessageType } from 'src/enums/MessageType';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { getInvoices } from 'src/redux/slices/invoices';
import { useDispatch, useSelector } from 'src/redux/store';
import { useRouter } from 'src/routes/hook';
import { IMail } from 'src/types/mail';
import { setTimeout } from 'timers';
// ----------------------------------------------------------------------
type Props = {
  mail?: IMail;
  isUploadInvoice?: boolean;
  onClickCancel: () => void;
};

export default function UploadView({ mail, onClickCancel, isUploadInvoice }: Props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const preview = useBoolean();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const roleCode = sessionStorage.getItem('roleCode') ?? '';
  const orgId = sessionStorage.getItem('orgId');
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID') ?? '0';
  const businessSearchQuery = sessionStorage.getItem('businessSearchQuery');
  const emailAddress = useSelector((state) => state.profile.profileData.invoiceReceivedEmail);
  const statusFiles = {
    numberOfInvoices: 0,
    numberOfCompareSuccess: 0,
    errorInvoicesSpare: 0,
    errorInvoicesNotFound: 0,
    errorInvoicesOther: 0,
  };
  const lstError = [
    {
      createdAt: '',
      errorList: [''],
      id: '',
      invoiceNumber: '',
      invoiceSerial: '',
      modifiedAt: '',
      version: 0,
      senderName: '',
      taxNumber: '',
    },
  ];
  const [lstErrorInvSpare, setLstErrorInvSpare] = useState(lstError);
  const [lstErrorOther, setLstErrorOther] = useState(lstError);
  const [lstErrorInvNotFound, setLstErrorInvNotFound] = useState(lstError);
  const [comp, setComp] = useState(false);
  const [stsFiles, setStsFiles] = useState(statusFiles);
  // const [file, setFile] = useState<File | string | null>(null);

  // const [avatarUrl, setAvatarUrl] = useState<File | string | null>(null);

  // const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
  //   const newFile = acceptedFiles[0];
  //   if (newFile) {
  //     setFile(
  //       Object.assign(newFile, {
  //         preview: URL.createObjectURL(newFile),
  //       })
  //     );
  //   }
  // }, []);

  // const handleDropAvatar = useCallback((acceptedFiles: File[]) => {
  //   const newFile = acceptedFiles[0];
  //   if (newFile) {
  //     setAvatarUrl(
  //       Object.assign(newFile, {
  //         preview: URL.createObjectURL(newFile),
  //       })
  //     );
  //   }
  // }, []);

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );
  const uploadErrorMsg = (errorType: string) => {
    switch (errorType) {
      case 'NOT_FOUND_XML_FILE':
        return 'Cần bổ sung file XML của hoá đơn!';
      case 'XML_FILE_INCOMPATIBLE':
        return 'Hệ thống không hỗ trợ đọc định dạng XML của hoá đơn này!';
      default:
        return '';
    }
  };
  const handleUpload = () => {
    const data = new FormData();
    if (isUploadInvoice) {
      console.log('NghiaLog: files - ', files);
      data.append('emailAddress', emailAddress);
      data.append('messageType', 'UPLOAD_INVOICE');
      files.forEach((f) => {
        data.append('files', f);
      });
    } else if (mail) {
      files.forEach((f, index) => {
        data.append(`file${index + 1}`, f);
      });
      data.append('mailId', mail?.id ?? '');
      data.append('attachmentFolderPath', mail?.attachmentFolderPath ?? '');
      data.append('emailAddress', mail?.mailFrom ?? '');
      data.append('messageType', MessageType.MAIL);
    } else {
      files.forEach((f, index) => {
        data.append(`file${index + 1}`, f);
      });
    }
    const token = sessionStorage.getItem('token');
    const accessToken: string = `Bearer ${token}`;
    setLoading(true);
    const urlUp = 'https://accountant-support-system.site/ass-admin/api/v1/files';
    const urlComp =
      'https://accountant-support-system.site/ass-admin/api/v1/files/invoices/compare';
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'content-type': 'multipart/form-data',
        Authorization: accessToken,
      },
    };
    const configUploadInvoices = {
      method: 'post',
      maxBodyLength: Infinity,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'content-type': 'multipart/form-data',
      },
    };
    if (!isUploadInvoice) {
      axios
        .post(!mail ? urlComp : urlUp, data, config)
        .then((response) => {
          setTimeout(() => {
            if (response.status === 200) {
              if (mail) {
                dispatch(
                  getMails(
                    roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId,
                    businessSearchQuery ?? ''
                  )
                );
                onClickCancel();
                router.replace(`${paths.dashboard.mail}/?id=${mail?.id}`);
              } else {
                setLoading(false);
                const numberofErrorInvSpare = response.data.errorInvoices.filter(
                  (item: { errorList: string | string[] }) => item.errorList.includes('spare')
                );
                const numberofErrorInvNotFound = response.data.errorInvoices.filter(
                  (item: { errorList: string | string[] }) => item.errorList.includes('not_found')
                );
                const numberofErrorInvOther = response.data.errorInvoices.filter(
                  (item: { errorList: string | string[] }) =>
                    !item.errorList.includes('not_found') && !item.errorList.includes('spare')
                );
                setLstErrorInvSpare(numberofErrorInvSpare);
                setLstErrorInvNotFound(numberofErrorInvNotFound);
                setLstErrorOther(numberofErrorInvOther);
                setStsFiles({
                  ...stsFiles,
                  numberOfInvoices: response.data.numberOfInvoices,
                  numberOfCompareSuccess: response.data.numberOfCompareSuccess,
                  errorInvoicesSpare: numberofErrorInvSpare.length,
                  errorInvoicesNotFound: numberofErrorInvNotFound.length,
                  errorInvoicesOther: numberofErrorInvOther.length,
                });
                setComp(true);
              }
            }
          }, 10000);
        })
        .catch((error) => {
          console.log(error);
          onClickCancel();
        });
    } else {
      axios
        .post(
          'https://us-central1-accountant-support-system.cloudfunctions.net/uploadInvoiceFiles',
          data,
          configUploadInvoices
        )
        .then((response) => {
          // setTimeout(() => {
          //   if (response.status === 200) {
          //     if (mail) {
          //       dispatch(
          //         getMails(
          //           roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId,
          //           businessSearchQuery ?? ''
          //         )
          //       );
          //       onClickCancel();
          //       router.replace(`${paths.dashboard.mail}/?id=${mail?.id}`);
          //     } else {
          //       setLoading(false);
          //       const numberofErrorInvSpare = response.data.errorInvoices.filter(
          //         (item: { errorList: string | string[] }) => item.errorList.includes('spare')
          //       );
          //       const numberofErrorInvNotFound = response.data.errorInvoices.filter(
          //         (item: { errorList: string | string[] }) => item.errorList.includes('not_found')
          //       );
          //       const numberofErrorInvOther = response.data.errorInvoices.filter(
          //         (item: { errorList: string | string[] }) =>
          //           !item.errorList.includes('not_found') && !item.errorList.includes('spare')
          //       );
          //       setLstErrorInvSpare(numberofErrorInvSpare);
          //       setLstErrorInvNotFound(numberofErrorInvNotFound);
          //       setLstErrorOther(numberofErrorInvOther);
          //       setStsFiles({
          //         ...stsFiles,
          //         numberOfInvoices: response.data.numberOfInvoices,
          //         numberOfCompareSuccess: response.data.numberOfCompareSuccess,
          //         errorInvoicesSpare: numberofErrorInvSpare.length,
          //         errorInvoicesNotFound: numberofErrorInvNotFound.length,
          //         errorInvoicesOther: numberofErrorInvOther.length,
          //       });
          //       setComp(true);
          //     }
          //   }
          // }, 10000);
          if (response.status === 200) {
            setTimeout(() => {
              onClickCancel();
              enqueueSnackbar('Tải lên thành công!');
              dispatch(
                getInvoices(
                  roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId ?? '',
                  true
                )
              );
            }, 10000);
          } else if (response.status === 400) {
            // onClickCancel();
          }
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(uploadErrorMsg(error.response.data.error), { variant: 'error' });
          setLoading(false);
        });
    }
  };
  const handleOnclickInvoice = (id: string) => {
    sessionStorage.setItem('idInvoice', id);
    window.open(paths.dashboard.invoice.details(id), '_blank');
  };
  return (
    <>
      {/* <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Upload"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Upload' },
            ]}
            moreLink={['https://react-dropzone.js.org/#section-basic-example']}
          />
        </Container>
      </Box> */}

      <Container sx={{ marginBottom: 5 }}>
        <Stack spacing={5}>
          <Card>
            {/* <CardHeader
              title="Upload Multi File"
              action={
                <FormControlLabel
                  control={<Switch checked={preview.value} onClick={preview.onToggle} />}
                  label="Show Thumbnail"
                />
              }
            /> */}
            <CardContent>
              <Stack
                spacing={2}
                sx={{
                  p: (theme) => theme.spacing(0, 0, 0, 0),
                }}
              >
                <Stack direction="row" alignItems="center" flexGrow={1}>
                  {!comp ? (
                    <Upload
                      multiple
                      thumbnail={preview.value}
                      files={files}
                      onDrop={handleDropMultiFile}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                      onUpload={() => handleUpload()}
                      mail={mail}
                      isUploadInvoice={isUploadInvoice}
                    />
                  ) : (
                    <Timeline
                      sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                        },
                      }}
                      position="right"
                    >
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot variant="outlined" color="warning" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {stsFiles.numberOfInvoices} hoá đơn được đưa và xác thực
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot variant="outlined" color="primary" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {stsFiles.numberOfCompareSuccess} hóa đơn đã được xác thực{' '}
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot variant="outlined" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {stsFiles.errorInvoicesSpare +
                            stsFiles.errorInvoicesNotFound +
                            stsFiles.errorInvoicesOther}{' '}
                          hóa đơn không xác thực gồm
                        </TimelineContent>
                      </TimelineItem>
                      {lstErrorInvSpare.length > 0 && (
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ fontWeight: 'bold' }}>
                            Danh sách {stsFiles.errorInvoicesSpare} hóa đơn không có trên cơ quan
                            thuế
                            <List>
                              {lstErrorInvSpare.map((item) => (
                                <ListItem disablePadding>
                                  <ListItemButton onClick={() => handleOnclickInvoice(item.id)}>
                                    <Iconify width={23} icon="mdi:dot" />
                                    <ListItemText
                                      primary={`Ký hiệu hóa đơn: ${item.invoiceSerial}`}
                                      secondary={`Số hóa đơn: ${item.invoiceNumber} `}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </List>
                          </TimelineContent>
                        </TimelineItem>
                      )}
                      {lstErrorOther.length > 0 && (
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ fontWeight: 'bold' }}>
                            Danh sách {stsFiles.errorInvoicesOther} hóa đơn sai thông tin
                            <List>
                              {lstErrorOther.map((item) => (
                                <ListItem disablePadding>
                                  <ListItemButton onClick={() => handleOnclickInvoice(item.id)}>
                                    <Iconify width={23} icon="mdi:dot" />
                                    <ListItemText
                                      primary={`Ký hiệu hóa đơn: ${item.invoiceSerial}`}
                                      secondary={`Số hóa đơn: ${item.invoiceNumber} `}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </List>
                          </TimelineContent>
                        </TimelineItem>
                      )}
                      {lstErrorInvNotFound.length > 0 && (
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ fontWeight: 'bold' }}>
                            Danh sách {stsFiles.errorInvoicesNotFound} hóa đơn thiếu cần bổ sung
                            <List>
                              {lstErrorInvNotFound.map((item) => (
                                <ListItem disablePadding>
                                  {/* <ListItemButton> */}
                                  <Iconify width={23} icon="mdi:dot" />
                                  <ListItemText
                                    primary={`MST người bán: ${item.taxNumber}`}
                                    secondary={`Ký hiệu hóa đơn: ${item.invoiceSerial}  -  Số hóa đơn: ${item.invoiceNumber}`}
                                  />
                                  {/* </ListItemButton> */}
                                </ListItem>
                              ))}
                            </List>
                          </TimelineContent>
                        </TimelineItem>
                      )}
                    </Timeline>
                  )}
                </Stack>
                {/* <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center" flexGrow={1} />
                  <Button
                    variant="outlined"
                    onClick={()=>onClickCancel()}
                  >
                    Hủy
                  </Button>
                  <Button
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    variant="contained"
                    color="primary"
                    // onClick={() => onClickUpload()}
                  >
                    Tải lên
                  </Button>

                </Stack> */}
              </Stack>
            </CardContent>
          </Card>
          {loading && renderLoading}
          {/* <Card>
            <CardHeader title="Upload Single File" />
            <CardContent>
              <Upload file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Upload Avatar" />
            <CardContent>
              <UploadAvatar
                file={avatarUrl}
                onDrop={handleDropAvatar}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Upload Box" />
            <CardContent>
              <Stack direction="row" spacing={2}>
                <UploadBox />

                <UploadBox
                  placeholder={
                    <Stack spacing={0.5} alignItems="center">
                      <Iconify icon="eva:cloud-upload-fill" width={40} />
                      <Typography variant="body2">Upload file</Typography>
                    </Stack>
                  }
                  sx={{ flexGrow: 1, height: 'auto', py: 2.5, mb: 3 }}
                />
              </Stack>
            </CardContent>
          </Card> */}
        </Stack>
      </Container>
    </>
  );
}
