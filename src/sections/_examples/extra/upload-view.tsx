'use client';

import { useCallback, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { getMails } from 'src/redux/slices/mail';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
// routes
import { paths } from 'src/routes/paths';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import axios from 'axios';
import { LoadingScreen } from 'src/components/loading-screen';
import { Upload } from 'src/components/upload';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { useDispatch } from 'src/redux/store';
import { useRouter } from 'src/routes/hook';
import { IMail } from 'src/types/mail';
// ----------------------------------------------------------------------
type Props = {
  mail?: IMail;
  onClickCancel: () => void;
};

export default function UploadView({ mail, onClickCancel }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const preview = useBoolean();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID');
  const roleCode = sessionStorage.getItem('roleCode');
  const orgId = sessionStorage.getItem('orgId');
  const businessSearchQuery = sessionStorage.getItem('businessSearchQuery');
  const statusFiles = {
    numberOfInvoices: 0,
    numberOfCompareSuccess: 0,
    errorInvoices: 0,
  };
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
  const handleUpload = () => {
    const data = new FormData();
    files.forEach((f, index) => {
      data.append(`file${index + 1}`, f);
    });
    if (mail) {
      data.append('mailId', mail?.id ?? '');
      data.append('attachmentFolderPath', mail?.attachmentFolderPath ?? '');
      data.append('emailAddress', mail?.mailFrom ?? '');
    }
    const token = sessionStorage.getItem('token');
    const accessToken: string = `Bearer ${token}`;
    setLoading(true);
    const urlUp =
      'https://accountant-support-system.site/ass-admin/api/v1/files';
    const urlComp = 'https://accountant-support-system.site/ass-admin/api/v1/files/invoices/compare';
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
              const numberofErrorInv= response.data.errorInvoices.filter((item: { errorList: string | string[]; })=> item.errorList.includes("spare"));
              setStsFiles({
                ...stsFiles,
                numberOfInvoices: response.data.numberOfInvoices,
                numberOfCompareSuccess: response.data.numberOfCompareSuccess,
                errorInvoices: numberofErrorInv.length,
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
                  p: (theme) => theme.spacing(0, 2, 2, 2),
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
                          {stsFiles.numberOfCompareSuccess}/{stsFiles.numberOfInvoices} hóa đơn đã
                          được xác thực{' '}
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot variant="outlined" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          {stsFiles.errorInvoices}/{stsFiles.numberOfInvoices} hóa đơn không xác
                          thực{' '}
                        </TimelineContent>
                      </TimelineItem>
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
