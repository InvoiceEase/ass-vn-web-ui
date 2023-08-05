'use client';

import { useCallback, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { getMails } from 'src/redux/slices/mail';

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
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { position } from 'stylis';
import { relative } from 'path';
import { Alert } from '@mui/material';
// ----------------------------------------------------------------------
type Props = {
  mail?: IMail;
  onClickCancel: () => void;
};

export default function UploadView({ mail, onClickCancel }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const preview = useBoolean();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID');
  const roleCode = sessionStorage.getItem('roleCode');
  const orgId = sessionStorage.getItem('orgId');
  const businessSearchQuery = sessionStorage.getItem('businessSearchQuery');
  const statusInvoice = {
    numberOfInvoices: 0,
    numberOfCompareSuccess: 0,
    errorInvoices: 0,
  };
  const [invoiceStatus, setInvoiceStatus] = useState(statusInvoice);
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

  const uploadOptions = {
    mailUpload: {
      pathRoute: `${paths.dashboard.mail}/?id=${mail?.id ?? ''}`,
      path: 'https://us-central1-accountant-support-system.cloudfunctions.net/uploadInvoiceFiles',
    },
    invoiceUpload: {
      pathRoute: `${paths.dashboard.invoice}`,
      path: 'https://accountant-support-system.site/ass-admin/api/v1/files',
    },
  };

  const handleUpload = async () => {
    const data = new FormData();
    files.forEach((f, index) => {
      if (!mail) {
        data.append(`file${index + 1}`, f);
      } else {
        data.append('files', f);
      }
    });
    if (mail) {
      data.append('mailId', mail?.id ?? '');
      data.append('attachmentFolderPath', mail?.attachmentFolderPath ?? '');
      data.append('emailAddress', mail?.mailFrom ?? '');
    }
    setLoading(true);
    const token = sessionStorage.getItem('token');
    const config = {
      maxBodyLength: Infinity,
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const timeOut = mail ? 1000 : 3000;
    axios
      .post(mail ? uploadOptions.mailUpload.path : uploadOptions.invoiceUpload.path, data, config)
      .then((response) => {
        setTimeout(() => {
          if (response.status === 200) {
            dispatch(
              getMails(
                roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId,
                businessSearchQuery ?? ''
              )
            );
            if (mail) {
              onClickCancel();
              router.replace(uploadOptions.mailUpload.pathRoute);
            } else {
              setInvoiceStatus({
                numberOfCompareSuccess: response.data.numberOfCompareSuccess,
                numberOfInvoices: response.data.numberOfInvoices,
                errorInvoices: response.data.errorInvoices.length,
              });
              setIsVerify(true);
              setLoading(false);
            }
          } else {
            setLoading(false);
            setIsFail(true);
          }
        }, timeOut);
      })
      .catch((error) => {
        setLoading(false);
        setIsFail(true);
        console.log(error);
      });
  };

  const renderVerifyPop = (
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
          {invoiceStatus.numberOfInvoices} hoá đơn được đưa và xác thực
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          {invoiceStatus.numberOfCompareSuccess}/{statusInvoice.numberOfInvoices} hóa đơn đã được
          xác thực
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="grey" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          {invoiceStatus.errorInvoices}/{statusInvoice.numberOfInvoices} hóa đơn không xác thực{' '}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );

  return (
    <Container sx={{ marginBottom: 5, marginTop: 2 }}>
      <Stack spacing={5}>
        <Card>
          <CardContent>
            <Stack
              spacing={2}
              sx={{
                p: (theme) => theme.spacing(0, 2, 2, 2),
              }}
            >
              <Stack direction="row" alignItems="center" flexGrow={1}>
                {isVerify ? (
                  renderVerifyPop
                ) : (
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
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {loading && renderLoading}
        {isFail && (
          <Alert severity="error">
            Thất bại
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
