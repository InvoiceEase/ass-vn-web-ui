// @mui
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
import SvgColor from 'src/components/svg-color';
//
import { useEffect } from 'react';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { getBusinesses } from 'src/redux/slices/business';
import { useDispatch, useSelector } from 'src/redux/store';
import { AccountPopover } from '../_common';
import CompanySelectionDropdown from '../_common/company-selection-dropdown/company-selection-dropdown';
import { HEADER, NAV } from '../config-layout';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const dispatch = useDispatch();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const role = sessionStorage.getItem('roleCode');

  const businesses = useSelector((state) => state.business.businesses);

  // const getBusinessOnContract = useCallback(async () => {
  //   const token = sessionStorage.getItem('token');
  //   const config = {
  //     headers: {
  //       accept: '*/*',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/contracts`,
  //     config
  //   );
  //   if (response.status === 200) {
  //     setBusinessData(response.data);
  //   }
  // }, []);

  useEffect(() => {
    if (role?.includes(RoleCodeEnum.Auditor)) {
      dispatch(getBusinesses());
    }
  }, []);

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/illustrations/ASS_Light_Mode.svg" />
        </IconButton>
      )}

      {/* {!role?.includes(RoleCodeEnum.Auditor) ? (
        <Searchbar />
      ) : ( */}
      {businesses.allIds.length > 0 && <CompanySelectionDropdown />}
      {/* )} */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* <LanguagePopover /> */}

        {/* <NotificationsPopover />

        <ContactsPopover /> */}

        {/* <SettingsButton /> */}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
