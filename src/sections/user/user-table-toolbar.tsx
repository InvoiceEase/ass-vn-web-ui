import { useCallback, useState } from 'react';
// @mui
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// types
import { IUserTableFiltersAdmin, IUserTableFilterValue } from 'src/types/profile';
// components
import { Autocomplete, OutlinedInput } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import CompanySelectionDropdown from 'src/layouts/_common/company-selection-dropdown/company-selection-dropdown';

// ----------------------------------------------------------------------

type Props = {
  filters: IUserTableFiltersAdmin;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  roleOptions: string[];
};

export default function UserTableToolbar({
  filters,
  onFilters,
  //
  roleOptions,
}: Props) {
  const popover = usePopover();
  const optionLst = [
    'Nhân Viên Doanh Nghiệp',
    'Auditor',
    'Kiểm duyệt viên',
    'Quản lý doanh nghiệp',
  ];
  const [option, setOption] = useState(optionLst[0]);
  const [role, setRole] = useState(filters.role);
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRole = useCallback(
    (event: SelectChangeEvent<string>) => {
      setRole(event.target.value);
      onFilters('role', event.target.value);
    },
    [onFilters]
  );

  const renderOptions = (
    <Autocomplete
      value={option}
      options={optionLst}
      onChange={(event: any, newValue: string | null) => {
        setOption(newValue || option[0]);
      }}
      renderInput={(params) => <TextField {...params} label="Option" />}
    />
  );
  const renderUserRole = (
    <Autocomplete
      value={filters.role}
      options={roleOptions}
      onChange={() => handleFilterRole}
      renderInput={(params) => <TextField {...params} label="Role" />}
    />
  );

  const renderComp = (
    <>
      <InputLabel>Company</InputLabel>
      <CompanySelectionDropdown />
    </>
  );

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
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Chức vụ</InputLabel>
          <Select
            value={filters.role}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Chức vụ" />}
            renderValue={(selected) => selected}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {/* <Checkbox disableRipple size="small" checked={filters.role.includes(item)} /> */}
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Tim kiếm theo tên hoặc email..."
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
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}
