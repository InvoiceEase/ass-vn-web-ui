'use client';

import { useCallback, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
// _mock
import { _userAbout, _userAddressBook, _userInvoices, _userPayment, _userPlans } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import { Divider, Stack } from '@mui/material';
import AccountBilling from '../account-billing';
import AccountChangePassword from '../account-change-password';
import AccountGeneral from '../account-general';
import AccountNotifications from '../account-notifications';
import AccountSocialLinks from '../account-social-links';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'billing',
    label: 'Billing',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: 'social',
    label: 'Social links',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}

      {/* <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs> */}

      <Grid container spacing={{ xs: 2, md: 10 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid>
          <h3>Tài khoản</h3>
          <h3>Thông tin doanh nghiệp</h3>
          <h3>Thanh toán</h3>
        </Grid>
        {currentTab === 'general' && <AccountGeneral />}
        <Grid>
          <Stack
            direction="column"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          >
            <h1>hehe</h1>
            <h1>hehe</h1>
            <h1>hehe</h1>
          </Stack>
        </Grid>
      </Grid>

      {currentTab === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )}

      {currentTab === 'notifications' && <AccountNotifications />}

      {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />}

      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
