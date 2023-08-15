import { useDropzone } from 'react-dropzone';
// @mui
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
//
//
import _ from 'lodash';
import Iconify from '../iconify/iconify';
import MultiFilePreview from './preview-multi-file';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

export default function UploadBox({
  placeholder,
  error,
  disabled,
  files,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasFile = !!files && !_.isEmpty(files[0]);

  const hasError = isDragReject || error;

  // const renderSinglePreview = (
  //   <SingleFilePreview imgUrl={typeof files === 'string' ? files : files[0]?.name} />
  // );

  return (
    <Box
      {...getRootProps()}
      sx={{
        m: 0.5,
        // width: 64,
        height: 64,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        color: 'text.disabled',
        justifyContent: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
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
        '&:hover': {
          opacity: 0.72,
        },
        ...sx,
      }}
    >
      <input {...getInputProps()} />

      {hasFile ? (
        <Box sx={{ my: 3 }}>
          <MultiFilePreview files={files} />
        </Box>
      ) : (
        <Iconify icon="eva:cloud-upload-fill" width={28} />
      )}

      {/* {hasFile ? renderSinglePreview : <Iconify icon="eva:cloud-upload-fill" width={28} />} */}
    </Box>
  );
}
