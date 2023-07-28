import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// assets
import { UploadIllustration } from 'src/assets/illustrations';
//
import Alert from '@mui/material/Alert';

import Iconify from '../iconify';
//
import { UploadProps } from './types';
import RejectionFiles from './errors-rejection-files';
import MultiFilePreview from './preview-multi-file';
import SingleFilePreview from './preview-single-file';
import { useEffect, useState } from 'react';

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
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    accept: { 'text/xml': [], 'application/pdf': [] },
    ...other,
  });
  const renderText = () => {
    if (!mail.isIncludedPdf) {
      return 'Vui lòng chọn file pdf còn thiếu của hóa đơn trong mail này. ';
    }
    if (!mail.isIncludedXml) {
      return 'Vui lòng chọn file pdf còn thiếu của hóa đơn trong mail này. ';
    }
    return 'Vui lòng chọn file pdf và xml còn thiếu của hóa đơn trong mail này.';
  };
  const hasFile = !!file && !multiple;
  const [errorPop, setErrorPop] = useState(false);
  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">Chọn file</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {renderText()}
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
    </>
  );
  useEffect(() => {
    files?.length > 2 ? removeFile() : setErrorPop(false);
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
        {!!errorPop && <Alert sx={{mt: 5}} severity="error">CHỈ ĐƯỢC UPLOAD TỐI ĐA 2 FILE THÔI NHE</Alert>}
        <RejectionFiles fileRejections={fileRejections} />

        {files?.length <= 2 && renderMultiPreview}
      </Box>
  );
}
