import { useDropzone } from 'react-dropzone';
// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
// assets
import { UploadIllustration } from 'src/assets/illustrations';
//

import Iconify from '../iconify';
//
import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import RejectionFiles from './errors-rejection-files';
import MultiFilePreview from './preview-multi-file';
import SingleFilePreview from './preview-single-file';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  mail,
  isUploadInvoice,
  sx,
  ...other
}: UploadProps) {
  const [text, setText] = useState('');
  const getFileType = () => {
    let result = {};
    if (isUploadInvoice) {
      result = { 'text/xml': [], 'application/pdf': [] };
    } else if (!mail) {
      result = { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [] };
    } else if (!mail?.isIncludedPdf && !mail?.isIncludedXml) {
      // setText("Vui lòng chọn file pdf và xml còn thiếu của hóa đơn trong mail này.");
      result = { 'text/xml': [], 'application/pdf': [] };
    } else if (mail?.isIncludedPdf && !mail?.isIncludedXml) {
      // setText("Vui lòng chọn file xml còn thiếu của hóa đơn trong mail này.");
      result = { 'text/xml': [] };
    } else if (!mail?.isIncludedPdf && mail?.isIncludedXml) {
      // setText("Vui lòng chọn file pdf còn thiếu của hóa đơn trong mail này.");
      result = { 'application/pdf': [] };
    }
    return result;
  };
  const getFileMissingMessage = () => {
    let result = '';
    if (isUploadInvoice) {
      result = 'Vui lòng chọn các hoá đơn cần tải lên.';
    } else if (!mail) {
      result = 'Vui lòng tải lên 2 file excel từ cơ quan thuế để so sánh.';
    } else if (!mail?.isIncludedPdf && !mail?.isIncludedXml) {
      result = 'Vui lòng chọn file pdf và xml còn thiếu của hóa đơn trong mail này.';
    } else if (mail?.isIncludedPdf && !mail?.isIncludedXml) {
      result = 'Vui lòng chọn file xml còn thiếu của hóa đơn trong mail này.';
    } else if (!mail?.isIncludedPdf && mail?.isIncludedXml) {
      result = 'Vui lòng chọn file pdf còn thiếu của hóa đơn trong mail này.';
    }
    return result;
  };
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    accept: getFileType(),
    ...other,
  });
  const hasFile = !!file && !multiple;
  const [errorPop, setErrorPop] = useState(false);
  const [errorPopEx, setErrorPopEx] = useState(false);
  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">Chọn file</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {getFileMissingMessage()}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
      </Box>

      {!errorPop && !errorPopEx && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          {onRemoveAll && (
            <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
              Hủy
            </Button>
          )}

          {onUpload && (
            <Button
              size="small"
              variant="contained"
              onClick={onUpload}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Tải lên
            </Button>
          )}
        </Stack>
      )}
    </>
  );
  useEffect(() => {
    if (isUploadInvoice) {
      setErrorPopEx(false);
    } else if (files?.length) {
      if (!mail && files?.length !== 2) {
        setErrorPopEx(true);
      } else {
        setErrorPopEx(false);
      }
      if (files?.length > 2) {
        removeFile();
      } else {
        setErrorPop(false);
      }
    }
  }, [files]);
  const removeFile = () => {
    setErrorPop(true);
    files?.pop();
  };
  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && helperText}
      {!!errorPop && (
        <Alert sx={{ mt: 5 }} severity="error">
          CHỈ ĐƯỢC TẢI LÊN TỐI ĐA 2 FILE
        </Alert>
      )}
      {!!errorPopEx && (
        <Alert sx={{ mt: 5 }} severity="error">
          TẢI LÊN ĐỦ 2 FILE
        </Alert>
      )}
      <RejectionFiles fileRejections={fileRejections} />

      {files?.length !== undefined && files?.length <= 2 && renderMultiPreview}
    </Box>
  );
}
