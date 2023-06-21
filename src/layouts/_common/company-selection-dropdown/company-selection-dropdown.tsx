'use client';

import { memo, useState } from 'react';
// @mui
import { MenuItem, Select } from '@mui/material';

const businessData = [
  {
    id: 1,
    name: 'FPT University',
  },
  {
    id: 2,
    name: 'MWG',
  },
  {
    id: 3,
    name: 'Nash Tech',
  },
  {
    id: 4,
    name: 'MoMo',
  },
];

function CompanySelectionDropdown() {
  const [selectedCompany, setSelectedCompany] = useState(businessData[0]);
  return (
    <>
      <Select
        // multiple
        value={selectedCompany.name}
        // onChange={handleFilterService}
        // input={<OutlinedInput label="Business" />}
        // renderValue={(selected) => selected.map((value) => value).join(', ')}
        // sx={{ textTransform: 'capitalize' }}
      >
        {businessData.map((option) => (
          <MenuItem key={option.id} value={option.name} onClick={() => setSelectedCompany(option)}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default memo(CompanySelectionDropdown);
