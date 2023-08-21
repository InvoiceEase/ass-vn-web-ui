'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../business-new-edit-form';
import { useSelector } from 'src/redux/store';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function BusinessDetailView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const _userList = useSelector((state) => state.auditor.auditors);

  const currentUser = _userList.find((user) => user.id === id);
  useEffect(()=>{console.log('use', currentUser)},[])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.userFullName},
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} isView/>
    </Container>
  );
}
