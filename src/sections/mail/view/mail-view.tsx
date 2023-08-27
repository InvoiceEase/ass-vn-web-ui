'use client';

import { useCallback, useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// routes

import { useSearchParams } from 'src/routes/hook';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Label from 'src/components/label';

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
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

function useInitial() {
  const router = useRouter();
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
    router.refresh();
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

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();
  const [mailFull, setMailFull]: any = useState([]);
  const [mailMiss, setMailMiss]: any = useState([]);
  const [mailSelect, setMailSelect]: any = useState([]);
  const [isFull, setIsFull] = useState(true);
  const [stsFile, setStsFile] = useState('Đủ File');
  const handleOpenCompose = useCallback(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  const FILE_STS_MAIL = ['Đủ File', 'Thiếu File'];

  const dispatch = useDispatch();

  const roleCode = sessionStorage.getItem('roleCode');

  const businessId = sessionStorage.getItem('selectedBusinessID');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = setTimeout(() => {
      sessionStorage.setItem('businessSearchQuery', searchQuery);
      if (businessId && businessId !== '0') {
        dispatch(getMails(businessId, searchQuery));
      }
    }, 800);
    return () => clearTimeout(getData);
  }, [searchQuery, businessId]);

  useEffect(() => {
    const mailLst = mails.allIds.map((item) => mails.byId[item]);
    const mailF = mailLst.filter((item) => item.isIncludedPdf && item.isIncludedXml);
    const mailM = mailLst.filter((item) => !item.isIncludedPdf || !item.isIncludedXml);
    setMailFull(mailF);
    setMailMiss(mailM);
  }, [mails]);
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

  const renderMailListFull = (
    <MailList
      mails={mailFull}
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

  const renderMailListMiss = (
    <MailList
      mails={mailMiss}
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

  const handleSelectMail = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setStsFile(newValue);
      if (newValue === 'Đủ File') {
        setIsFull(true);
        setMailSelect(mailFull);
      } else {
        setIsFull(false);
        setMailSelect(mailMiss);
      }
    },
    [mailSelect]
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
                  value={stsFile}
                  onChange={handleSelectMail}
                  sx={{
                    px: 2.5,
                    boxShadow: (theme) =>
                      `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                    display: 'flex',
                    position: 'static',
                  }}
                >
                  {FILE_STS_MAIL.map((tab) => (
                    <Tab
                      key={tab}
                      iconPosition="end"
                      value={tab}
                      label={tab}
                      icon={
                        <Label
                          variant={
                            ((tab === 'Đủ File' || tab === 'Thiếu File') && 'filled') || 'soft'
                          }
                          color={
                            (tab === 'Đủ File' && 'success') ||
                            (tab === 'Thiếu File' && 'error') ||
                            'default'
                          }
                        >
                          {tab === 'Đủ File' && mailFull.length}

                          {tab === 'Thiếu File' && mailMiss.length}
                        </Label>
                      }
                    />
                  ))}
                </Tabs>
              </Stack>

              {isFull ? renderMailListFull : renderMailListMiss}
            </Stack>

            {mailsStatus.loading ? renderLoading : renderMailDetails}
          </Stack>
        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
