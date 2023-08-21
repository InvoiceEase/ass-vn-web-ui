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
import { useSelector } from 'src/redux/store';
import BusinessNewEditForm from '../business-new-edit-form';

// ----------------------------------------------------------------------

export default function BusinessEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const _businessList = useSelector((state) => state.business.businessAdmin);
  // const _userList = useSelector((state) => state.auditor.auditors);

  const currentBiz = _businessList.find((item) => item.id === id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
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
      /> */}

      <BusinessNewEditForm currentBiz={currentBiz}/>
    </Container>
  );
}
