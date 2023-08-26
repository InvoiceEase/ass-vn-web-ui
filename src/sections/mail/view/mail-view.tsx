'use client';

import { useCallback, useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// routes
import Label from 'src/components/label';

import { useSearchParams } from 'src/routes/hook';
import { alpha } from '@mui/material/styles';

// redux
import { getMail, getMails } from 'src/redux/slices/mail';
import { useDispatch } from 'src/redux/store';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
//
import { InputAdornment, TextField } from '@mui/material';
import BusinessPicker from 'src/components/business-picker/business-picker';
import Iconify from 'src/components/iconify/iconify';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { useMail } from '../hooks';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';
import MailHeader from '../mail-header';
import MailList from '../mail-list';
import MailNav from '../mail-nav';
import { IMail } from 'src/types/mail';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// ----------------------------------------------------------------------

function useInitial() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const labelParam = searchParams.get('label');

  const mailParam = searchParams.get('id');

  const roleCode = sessionStorage.getItem('roleCode');

  const businessId = sessionStorage.getItem('selectedBusinessID');

  const orgId = sessionStorage.getItem('orgId');

  // const getLabelsCallback = useCallback(() => {
  //   dispatch(getLabels());
  // }, [dispatch]);

  const getMailsCallback = useCallback(() => {
    if (roleCode?.includes(RoleCodeEnum.Auditor)) {
      if (businessId && businessId !== '0') {
        dispatch(getMails(businessId, '', 0));
      }
    } else if (orgId && orgId !== '0') {
      dispatch(getMails(orgId, '', 0));
    }
  }, [dispatch, labelParam]);

  const getMailCallback = useCallback(() => {
    if (mailParam) {
      dispatch(getMail(mailParam));
    }
  }, [dispatch, mailParam]);

  // useEffect(() => {
  //   getLabelsCallback();
  // }, [getLabelsCallback]);

  useEffect(() => {
    getMailsCallback();
  }, [getMailsCallback]);

  useEffect(() => {
    getMailCallback();
  }, [getMailCallback]);

  return null;
}

// ----------------------------------------------------------------------

export default function MailView() {
  useInitial();

  const {
    mail,
    mails,
    mailParam,
    mailsStatus,
    onClickMail,
    onClickNavItem,
    //
    labels,
    labelParam,
    labelsStatus,
  } = useMail();
  const TAB_STATUS =['hasFile','noFile'];

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();
  const [mailFull, setMailFull]: IMail = useState({});
  const [mailMiss, setMailMiss]: IMail = useState({});

  const handleOpenCompose = useCallback(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  const dispatch = useDispatch();

  const roleCode = sessionStorage.getItem('roleCode');

  const businessId = sessionStorage.getItem('selectedBusinessID');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = setTimeout(() => {
      sessionStorage.setItem('businessSearchQuery', searchQuery);
      const mailList = mails.allIds.map((mailId) => mails.byId[mailId]);
      if (businessId && businessId !== '0') {
        dispatch(getMails(businessId, searchQuery));
        const mailF = mailList.filter((item) => item.isIncludedPdf || item.isIncludedXml);
        const mailL = mailList.filter((item) => !item.isIncludedPdf && !item.isIncludedXml);
        setMailFull(mailF[0]);
        setMailMiss(mailL[0]);
      }
    }, 800);
    return () => clearTimeout(getData);
  }, [searchQuery]);

  useEffect(() => {
    handleOpenCompose();
  }, [handleOpenCompose]);

  const handleToggleCompose = useCallback(() => {
    if (openNav.value) {
      openNav.onFalse();
    }
    openCompose.onToggle();
  }, [openCompose, openNav]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderEmpty = (
    <EmptyContent
      title={`Nothing in ${labelParam}`}
      description="This folder is empty"
      imgUrl="/assets/icons/empty/ic_folder_empty.svg"
      sx={{
        borderRadius: 1.5,
        maxWidth: { md: 320 },
        bgcolor: 'background.default',
      }}
    />
  );

  const renderMailNav = (
    <MailNav
      loading={labelsStatus.loading}
      openNav={openNav.value}
      onCloseNav={openNav.onFalse}
      //
      labels={labels}
      labelParam={labelParam}
      //
      onToggleCompose={handleToggleCompose}
      onClickNavItem={onClickNavItem}
    />
  );

  const renderMailList = (
    <MailList
      mails={mails}
      loading={mailsStatus.loading}
      //
      openMail={openMail.value}
      onCloseMail={openMail.onFalse}
      onClickMail={onClickMail}
      //
      currentLabel={labelParam}
      selectedMail={(id: string) => mailParam === id}
    />
  );

  const renderMailDetails = (
    <>
      {mailsStatus.empty ? (
        <EmptyContent
          imgUrl="/assets/icons/empty/ic_email_disabled.svg"
          sx={{
            borderRadius: 1.5,
            bgcolor: 'background.default',
            ...(!upMd && {
              display: 'none',
            }),
          }}
        />
      ) : (
        <MailDetails
          mail={mail}
          renderLabel={(id: string) => labels.filter((label) => label.id === id)[0]}
        />
      )}
    </>
  );

  return (
    <>
      {roleCode?.includes(RoleCodeEnum.Auditor) && <BusinessPicker />}
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          spacing={1}
          sx={{
            p: 1,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'background.neutral',
          }}
        >
          {!upMd && (
            <MailHeader
              onOpenNav={openNav.onTrue}
              onOpenMail={mailsStatus.empty ? null : openMail.onTrue}
            />
          )}

          <Stack
            spacing={1}
            direction="row"
            flexGrow={1}
            sx={{
              height: {
                xs: '72vh',
              },
            }}
          >
            {/* {renderMailNav} */}
            <Stack
              sx={{
                width: 400,
                flexShrink: 0,
                borderRadius: 1.5,
                bgcolor: 'background.default',
              }}
            >
              <Stack sx={{ p: 2 }}>
                <TextField
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Tabs
                  value={TAB_STATUS}
                  // onChange={handleFilterStatus}
                  sx={{
                    px: 2.5,
                    boxShadow: (theme) =>
                      `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                    display: 'flex',
                    position: 'static',
                  }}
                >
                  {TAB_STATUS.map((tab) => (
                    <Tab
                      key={tab}
                      iconPosition="end"
                      value={tab}
                      label={tab}
                      icon={
                        <Label
                          variant={
                            ((tab === 'All' || tab === '') && 'filled') || 'soft'
                          }
                          color={
                            (tab === 'Active' && 'success') ||
                            (tab === 'Banned' && 'error') ||
                            'default'
                          }
                        >
                          {/* {tab === 'All' && _userList.length}
                          {tab === 'Active' &&
                            _userList.filter((user) => user.status === 'Active').length}

                          {tab === 'Banned' &&
                            _userList.filter((user) => user.status === 'Banned').length} */}
                        </Label>
                      }
                    />
                  ))}
                </Tabs>
              </Stack>

              {mailsStatus.empty ? renderEmpty : renderMailList}
            </Stack>

            {mailsStatus.loading ? renderLoading : renderMailDetails}
          </Stack>
        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
