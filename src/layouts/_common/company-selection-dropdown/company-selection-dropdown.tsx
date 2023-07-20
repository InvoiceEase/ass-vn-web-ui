'use client';

import { memo, useEffect, useState } from 'react';
// @mui
import { MenuItem, Select } from '@mui/material';
import { setSelectedBusiness } from 'src/redux/slices/business';
import { getMails } from 'src/redux/slices/mail';
import { useDispatch, useSelector } from 'src/redux/store';
import { IBusiness } from 'src/types/business';

const defaultBusinessItem: IBusiness = {
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

function CompanySelectionDropdown() {
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(defaultBusinessItem);
  const [businessesName, setBusinessesName] = useState(['']);
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID');

  const businesses = useSelector((state) => state.business.businesses);
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);

  const handleSelectBusiness = (option: IBusiness) => {
    sessionStorage.setItem('selectedBusinessID', option?.id);
    setSelectedCompany(option);
    dispatch(setSelectedBusiness(option));
    if (option.id && option.id !== '0') {
      dispatch(getMails(option.id, '', 0));
    }
  };

  const getBusinessesName = () => {
    const result: string[] = [];
    businesses.allIds.map((id) => result.push(businesses.byId[id].name));
    setBusinessesName(result);
  };

  useEffect(() => {
    setSelectedCompany(businesses.byId[8]);
    sessionStorage.setItem('selectedBusinessID', selectedCompany?.id);
    if (selectedCompany?.id && selectedCompany?.id !== '0') {
      dispatch(getMails(selectedCompany?.id, '', 0));
    }
    getBusinessesName();
  }, [businesses]);

  useEffect(() => {
    if (selectedBusinessID) {
      setSelectedCompany(businesses.byId[selectedBusinessID]);
    }
  }, [selectedBusinessID]);

  return (
    <Select
      // multiple
      value={selectedBusiness?.name}
      // onChange={handleFilterService}
      // input={<OutlinedInput label="Business" />}
      // renderValue={(selected) => selected.map((value) => value).join(', ')}
      // sx={{ textTransform: 'capitalize' }}
    >
      {businesses.allIds.map((id) => (
        <MenuItem
          key={id}
          value={businesses.byId[id].name}
          onClick={() => handleSelectBusiness(businesses.byId[id])}
        >
          {businesses.byId[id].name}
        </MenuItem>
      ))}
    </Select>
    // <Typography
    //   variant="h4"
    //   sx={{
    //     width: '100%',
    //     maxWidth: 280,
    //     ml: { xs: 1, md: 3 },
    //   }}
    // >
    //   <Autocomplete
    //     id="free-solo-demo"
    //     options={businesses.byId}
    //     onChange={(event: any, newValue: string | null) => {
    //       setSelectedCompany(newValue);
    //       sessionStorage.setItem('selectedBusinessID', selectedCompany?.id);
    //     }}
    //     value={selectedCompany?.name}
    //     renderInput={(params) => <TextField {...params} />}
    //   />
    // </Typography>
  );
}

export default memo(CompanySelectionDropdown);
