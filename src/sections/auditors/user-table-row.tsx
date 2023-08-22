// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
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

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IAuditor;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onResetRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onResetRow,
}: Props) {
  const { userFullName, phoneNumber, roleName, email, status } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();
  const handleDelete = () => {
    confirm.onFalse();
    onDeleteRow();
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          {/* <Checkbox checked={selected} onClick={onSelectRow} /> */}
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={userFullName}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell> */}
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{`0${phoneNumber.substring(3)}`}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{roleName}</TableCell>
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
          {/* <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip> */}

          {status !== 'Banned' && (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {status !== 'Banned' && (
          <MenuItem
            onClick={() => {
              onSelectRow();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:eye" />
            Xem chi tiết
          </MenuItem>
        )}
        {/* {roleName === 'Kiểm duyệt viên' && (
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Đăng ký
          </MenuItem>
        )}
        {status !== 'Banned' && (
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Cấm
          </MenuItem>
        )} */}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Bạn vẫn muốn cấm người này?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Cấm
          </Button>
        }
      />
    </>
  );
}
