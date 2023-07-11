'use client';

import { useCallback, useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { useSearchParams } from 'src/routes/hook';
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
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Iconify from 'src/components/iconify/iconify';
import { useMail } from '../hooks';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';
import MailHeader from '../mail-header';
import MailList from '../mail-list';
import MailNav from '../mail-nav';

// ----------------------------------------------------------------------

function useInitial() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const labelParam = searchParams.get('label');

  const mailParam = searchParams.get('id');

  const businessId = sessionStorage.getItem('selectedBusinessID');

  // const getLabelsCallback = useCallback(() => {
  //   dispatch(getLabels());
  // }, [dispatch]);

  const getMailsCallback = useCallback(() => {
    if (businessId && businessId !== '0') {
      dispatch(getMails(businessId, '', 0));
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

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();

  const handleOpenCompose = useCallback(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);
  useEffect(() => {
    setOpen(true);
  }, []);
  const dispatch = useDispatch();

  const businessId = sessionStorage.getItem('selectedBusinessID');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = setTimeout(() => {
      sessionStorage.setItem('businessSearchQuery', searchQuery);
      if (businessId && businessId !== '0') dispatch(getMails(businessId, searchQuery));
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
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const role = ['FPT University', 'Công ty nào đó tên gì đó mà dài vcl', 'CTCP Đầu tư Thế giới Di động', 'Nash Tech', 'Cyber Logitech'];

  return (
    <>
      <div>

        <Dialog
          open={open}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Chọn công ty</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              // ref={descriptionElementRef}
              tabIndex={-1}
            >
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          FPT University
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Công ty nào đó tên gì đó mà dài vcl
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          CTCP Đầu tư Thế giới Di động
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Nash Tech
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Cyber Logitech
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Nash Tech
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Nash Tech
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>

                <DialogActions>
                  <ListItemButton onClick={handleClose}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          Nash Tech
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </DialogActions>
              </List>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography
          variant="h4"
          sx={{
            width: '100%',
            maxWidth: 280,
            mb: { xs: 1, md: 5 },
            ml: {xs: 1, md: 3}
          }}
        >
          <Autocomplete
            id="free-solo-demo"
            options={role}
            onChange={(event: any, newValue: string | null) => {
              // setUserRole(newValue || role[0]);
            }}
            value="ACCOUNTANT"
            renderInput={(params) => <TextField {...params} />}
          />
        </Typography>

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
            {/* {/* {renderMailNav} */}
            <Stack
              sx={{
                width: 320,
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
              </Stack> */}

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
