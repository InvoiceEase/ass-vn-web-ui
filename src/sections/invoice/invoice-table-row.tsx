import { format } from 'date-fns';
// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IInvoice } from 'src/types/invoice';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { InvoiceStatusConfig } from './InvoiceStatusConfig';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  isInputInvoice: boolean;
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  isInputInvoice,
}: Props) {
  const {
    invoiceName,
    invoiceCharacter,
    invoiceCreatedDate,
    status,
    totalPrice,
    receiverName,
    senderName,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={receiverName} sx={{ mr: 2 }}>
            {receiverName.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.primary', cursor: 'pointer' }}
              >
                <Typography variant="body2" noWrap>
                  {invoiceName}
                </Typography>
              </Link>
            }
            secondary={
              <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                {isInputInvoice ? senderName : receiverName}
              </Typography>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(invoiceCreatedDate), 'dd/MM/yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>{`${fCurrency(totalPrice)} ${row.currency}`}</TableCell>

        <TableCell>{invoiceCharacter}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === InvoiceStatusConfig.approved.status &&
                InvoiceStatusConfig.approved.color) ||
              (status === InvoiceStatusConfig.authenticated.status &&
                InvoiceStatusConfig.authenticated.color) ||
              (status === InvoiceStatusConfig.unapproved.status &&
                InvoiceStatusConfig.unapproved.color) ||
              (status === InvoiceStatusConfig.unauthenticated.status &&
                InvoiceStatusConfig.unauthenticated.color) ||
              (status === InvoiceStatusConfig.notAuthenticated.status &&
                InvoiceStatusConfig.notAuthenticated.color) ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
