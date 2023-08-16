import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Stack, Typography } from '@mui/material';

interface Props {
  invoiceSerial?: string;
  isSigned?: boolean;
  invoiceCharacter?: string;
}

export default function InvoiceInfoField({ invoiceCharacter, invoiceSerial, isSigned }: Props) {
  return (
    <Stack direction="row" sx={{ mb: 1 }}>
      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
      {invoiceSerial && invoiceSerial !== '' && (
        <Typography variant="body1" color="#118D57">
          Đã cấp mã hóa đơn
        </Typography>
      )}
      {/* {isSigned !== undefined && (
        <Typography variant="body1" color="#118D57">
          {isSigned ? 'Hoá đơn đã được ký điện tử' : 'Hoá đơn chưa được ký điện tử'}
        </Typography>
      )} */}
      {invoiceCharacter && (
        <Typography variant="body1" color="#118D57">
          {`Tính chất hoá đơn: ${invoiceCharacter}`}
        </Typography>
      )}
    </Stack>
  );
}
