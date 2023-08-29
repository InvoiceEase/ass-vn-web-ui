// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
//
import { IAuditor } from 'src/types/auditor';
import { IBusiness, IBusinessAdmin } from 'src/types/business';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IBusinessAdmin;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onResetRow: VoidFunction;
  onActiveRow: VoidFunction;
};

export default function BusinessTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onResetRow,
  onActiveRow,
}: Props) {
  const {
    id,
    name,
    email,
    taxNumber,
    invoiceReceivedEmail,
    representPersonName,
    needAudit,
    status,
  } = row;

  const confirm = useBoolean();
  const confirmActive = useBoolean();
  const quickEdit = useBoolean();

  const popover = usePopover();
  const handleDelete = (isActive: boolean) => {
    if (isActive) {
      confirmActive.onFalse();
      onActiveRow();
    } else {
      confirm.onFalse();
      onDeleteRow();
    }
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox checked={selected} onClick={onSelectRow} /> */}
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{representPersonName}</TableCell>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{taxNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{invoiceReceivedEmail}</TableCell>
        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (needAudit === true && 'error') || (needAudit === false && 'success') || 'default'
            }
          >
            {needAudit === true ? 'Cần kiểm duyệt viên' : 'Không cần kiểm duyệt viên'}
          </Label>
        </TableCell> */}

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Active' && 'success') ||
              // (status === 'PENDING' && 'warning') ||
              (status === 'Banned' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onSelectRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:eye" />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh sửa
        </MenuItem>
        {status !== 'Banned' ? (
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Vô hiệu hóa
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              confirmActive.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="fontisto:checkbox-active" />
            Kích hoạt
          </MenuItem>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Vô hiệu hóa"
        content="Bạn vẫn muốn vô hiệu hóa doanh nghiệp này?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDelete(false)}>
            Vô hiệu hóa
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmActive.value}
        onClose={confirmActive.onFalse}
        title="Kích hoạt"
        content="Bạn muốn kích hoạt doanh nghiệp này?"
        action={
          <Button variant="contained" color="success" onClick={() => handleDelete(true)}>
            Kích hoạt
          </Button>
        }
      />
    </>
  );
}
