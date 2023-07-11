'use client';

import { memo, useEffect, useState } from 'react';
// @mui
import { MenuItem, Select } from '@mui/material';
import { getMails } from 'src/redux/slices/mail';
import { useDispatch } from 'src/redux/store';

interface businessItem {
  id: string;
  createdAt: string;
  modifiedAt: string;
  version: null;
  name: string;
  address: string;
  website: null;
  taxNumber: null;
  email: string;
  logo: null;
  invoiceReceivedEmail: string;
  engName: null;
}

const defaultBusinessItem: businessItem = {
  id: '0',
  createdAt: '',
  modifiedAt: '',
  version: null,
  name: '',
  address: '',
  website: null,
  taxNumber: null,
  email: '',
  logo: null,
  invoiceReceivedEmail: '',
  engName: null,
};

function CompanySelectionDropdown({ businessData }: { businessData: businessItem[] }) {
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(defaultBusinessItem);

  const handleSelectBusiness = (option: businessItem) => {
    setSelectedCompany(option);
    if (option.id && option.id !== '0') {
      dispatch(getMails(option.id, '', 0));
    }
  };

  useEffect(() => {
    setSelectedCompany(businessData[0]);
    sessionStorage.setItem('selectedBusinessID', selectedCompany.id);
    if (selectedCompany.id && selectedCompany.id !== '0') {
      dispatch(getMails(selectedCompany.id, '', 0));
    }
  }, [businessData]);

  return (
    <Select
      // multiple
      value={selectedCompany.name}
      // onChange={handleFilterService}
      // input={<OutlinedInput label="Business" />}
      // renderValue={(selected) => selected.map((value) => value).join(', ')}
      // sx={{ textTransform: 'capitalize' }}
    >
      {businessData.map((option: businessItem) => (
        <MenuItem key={option.id} value={option.name} onClick={() => handleSelectBusiness(option)}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default memo(CompanySelectionDropdown);
