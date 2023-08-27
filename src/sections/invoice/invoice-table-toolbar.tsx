import { useCallback, useState } from 'react';
// @mui
import InputAdornment from '@mui/material/InputAdornment';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// types
import { IInvoiceTableFilters, IInvoiceTableFilterValue } from 'src/types/invoice';
// components
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import FileUpload from 'src/components/file-uploader/file-uploader';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: IInvoiceTableFilters;
  onFilters: (name: string, value: IInvoiceTableFilterValue) => void;
  //
  serviceOptions: string[];
};

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  //
  serviceOptions,
}: Props) {
  const characterRole = [
    'Hóa đơn mới',
    'Hóa đơn bị điều chỉnh',
    'Hóa đơn điều chỉnh',
    'Hóa đơn bị thay thế',
    'Hóa đơn thay thế',
  ];

  const popover = usePopover();

  const [openUpload, setOpenUpload] = useState(false);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('attribute', event.target.value);
    },
    [onFilters]
  );

  // const handleFilterStartDate = useCallback(
  //   (newValue: Date | null) => {
  //     onFilters('startDate', newValue);
  //   },
  //   [onFilters]
  // );

  // const handleFilterEndDate = useCallback(
  //   (newValue: Date | null) => {
  //     onFilters('endDate', newValue);
  //   },
  //   [onFilters]
  // );

  // const onClickUpload = () => {
  //   setOpenUpload(true);
  // };

  const handleUpload = () => {
    setOpenUpload(true);
  };

  const resetUpload = () => {
    setOpenUpload(false);
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 180 },
          }}
        >
          <InputLabel>Tính chất hóa đơn</InputLabel>

          <Select
            onChange={handleFilterService}
            value={filters.attribute}
            input={<OutlinedInput label="Tính chất hóa đơn" />}
            renderValue={(selected) => selected}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {characterRole.map((option) => (
              <MenuItem key={option} value={option}>
                {/* <Checkbox disableRipple size="small" checked={filters.service.includes(option)} /> */}
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            sx={{ width: '53vw' }}
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Tìm hoá đơn theo tên..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
          <Button
            onClick={() => {
              popover.onClose();
              setOpenUpload(true);
            }}
          >
            <Iconify icon="solar:export-bold" />
            Tải lên
          </Button>
          <Button
            variant="text"
            color="inherit"
            endIcon={<Iconify icon="eva:done-all-outline" />}
            onClick={() => handleUpload()}
          >
            Xác thực
          </Button>
        </Stack>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            setOpenUpload(true);
          }}
        >
          <Iconify icon="solar:export-bold" />
          Tải lên
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Xuất tài liệu
        </MenuItem>
      </CustomPopover> */}
      {openUpload && <FileUpload isOpen={openUpload} onCanCel={resetUpload} isUploadInvoice />}
    </>
  );
}
