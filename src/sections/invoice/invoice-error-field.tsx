import CancelIcon from '@mui/icons-material/Cancel';
import { Stack, Typography } from '@mui/material';
import { InvoiceErrorFieldEnum } from 'src/enums/InvoiceErrorFieldEnum';

interface Props {
  type: string;
}

const mapErrorFieldMessage = (type: string) => {
  switch (type) {
    case InvoiceErrorFieldEnum.ReceiverAddress:
      return 'Địa chỉ bên mua không chính xác';
    case InvoiceErrorFieldEnum.ReceiverName:
      return 'Tên bên mua không chính xác';
    case InvoiceErrorFieldEnum.ReceiverTaxCode:
      return 'MST bên mua không chính xác';
    case InvoiceErrorFieldEnum.SenderAddress:
      return 'Địa chỉ bên bán không chính xác';
    case InvoiceErrorFieldEnum.SenderName:
      return 'Tên bên bán không chính xác';
    case InvoiceErrorFieldEnum.SenderTaxCode:
      return 'MST bên bán không chính xác';
    case InvoiceErrorFieldEnum.Spare:
      return 'Hóa đơn không có trên cơ quan thuế';
    default:
      return '';
  }
};

export default function InvoiceErrorField({ type }: Props) {
  return (
    <Stack direction="row" sx={{ mb: 1 }}>
      <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="body1" color="#B71D18">
        {mapErrorFieldMessage(type)}
      </Typography>
    </Stack>
  );
}
