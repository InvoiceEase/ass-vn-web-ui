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
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { periodDeclarationTypes } from 'src/assets/data';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSnackbar } from 'src/components/snackbar';
import { useDispatch, useSelector } from 'src/redux/store';
import { IUserAccount } from 'src/types/profile';
import * as Yup from 'yup';
import AccountBilling from '../account-billing';
import AccountChangePassword from '../account-change-password';
import AccountGeneral from '../account-general';
import AccountNotifications from '../account-notifications';
import AccountSocialLinks from '../account-social-links';
import AccountStepper from './account-stepper';

// ----------------------------------------------------------------------

type FormValuesProps = IUserAccount;

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
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const formStep = useSelector((state) => state.profile.profileFormStep);

  const user = useSelector((state) => state.profile.profileData);

  const businessTypes = useSelector((state) => state.business.businessTypes);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Business name is required'),
    address: Yup.string().required('Address is required'),
    taxNumber: Yup.string().required('Tax code is required'),
    businessTypeId: Yup.string().required('Business type is required'),
    representPersonName: Yup.string().required('Representative name is required'),
    invoiceReceivedEmail: Yup.string().required('Invoice received mail is required'),
    domainBusinessId: Yup.string().required('Tax declaration type is required'),
  });
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const defaultValues = {
    name: user?.name || '',
    address: user?.address || '',
    taxNumber: user?.taxNumber || '',
    businessTypeId: +businessTypes.byId[user?.businessTypeId ?? 0]?.id || null,
    representPersonName: user?.representPersonName || '',
    invoiceReceivedEmail: user?.invoiceReceivedEmail || '',
    declarationPeriod:
      periodDeclarationTypes.filter((item) => item.id?.toString() === user?.declarationPeriod)[0]
        ?.label || null,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar('Cập nhật thành công!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

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

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs>
            <h3>Tài khoản</h3>
            <h3>Thông tin doanh nghiệp</h3>
            {/* <h3>Thanh toán</h3> */}
          </Grid>
          {currentTab === 'general' && (
            <Grid xs={6}>
              <AccountGeneral />
            </Grid>
          )}
          <Grid xs>
            <AccountStepper />
          </Grid>
        </Grid>
      </FormProvider>

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
