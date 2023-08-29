// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import TextMaxLine from 'src/components/text-max-line';
// types
import { useState } from 'react';
import FileUpload from 'src/components/file-uploader/file-uploader';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { IMail, IMailLabel } from 'src/types/mail';

// ----------------------------------------------------------------------

type Props = {
  mail: IMail;
  renderLabel: (id: string) => IMailLabel;
};

export default function MailDetails({ mail, renderLabel }: Props) {
  const showAttachments = useBoolean(true);
  const router = useRouter();
  const [openUpload, setOpenUpload] = useState(false);
  if (!mail) {
    return (
      <EmptyContent
        title="Không có mail đang được chọn"
        description="Chọn một mail để xem"
        imgUrl="/assets/icons/empty/ic_email_selected.svg"
        sx={{
          borderRadius: 1.5,
          bgcolor: 'background.default',
        }}
      />
    );
  }

  const renderHead = (
    <Stack direction="row" alignItems="center" flexShrink={0} sx={{ height: 56, pl: 2, pr: 1 }}>
      <Stack direction="row" spacing={1} flexGrow={1}>
        {/* {mail.labelIds.map((labelId) => {
          const label = renderLabel(labelId);

          return label ? (
            <Label
              key={label.id}
              sx={{
                bgcolor: alpha(label.color, 0.16),
                color: (theme) =>
                  theme.palette.mode === 'light'
                    ? darken(label.color, 0.24)
                    : lighten(label.color, 0.24),
              }}
            >
              {label.name}
            </Label>
          ) : null;
        })} */}
      </Stack>

      <Stack direction="row" alignItems="center">
        {/* <Checkbox
          color="warning"
          icon={<Iconify icon="eva:star-outline" />}
          checkedIcon={<Iconify icon="eva:star-fill" />}
          checked={mail.isStarred}
        />
        <Checkbox
          color="warning"
          icon={<Iconify icon="material-symbols:label-important-rounded" />}
          checkedIcon={<Iconify icon="material-symbols:label-important-rounded" />}
          checked={mail.isImportant}
        /> */}
        {/* <IconButton>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </Stack>
    </Stack>
  );

  const renderSubject = (
    <Stack spacing={2} direction="row" flexShrink={0} sx={{ p: 2 }}>
      <TextMaxLine variant="subtitle2" sx={{ flexGrow: 1 }}>
        Re: {mail.subject}
      </TextMaxLine>

      <Stack spacing={0.5}>
        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <IconButton size="small">
            <Iconify width={18} icon="solar:reply-bold" />
          </IconButton>

          <IconButton size="small">
            <Iconify width={18} icon="solar:multiple-forward-left-broken" />
          </IconButton>

          <IconButton size="small">
            <Iconify width={18} icon="solar:forward-bold" />
          </IconButton>
        </Stack>

        <Typography variant="caption" noWrap sx={{ color: 'text.disabled' }}>
          {fDateTime(mail.createdAt)}
        </Typography> */}
      </Stack>
    </Stack>
  );

  const renderSender = (
    <Stack
      flexShrink={0}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 2, 1, 2),
      }}
    >
      {/* <Avatar alt={mail.mailFrom} src={`${mail.from.avatarUrl}`} sx={{ mr: 2 }}>
        {mail.mailFrom.charAt(0).toUpperCase()}
      </Avatar> */}

      {/* <ListItemText
        primary={
          <>
            {mail.mailFrom}
            <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
              {` <${mail.mailFrom}>`}
            </Box>
          </>
        }
        secondary={
          <>
            {`To: `}
            {mail.to.map((person) => (
              <Link key={person.email} sx={{ color: 'text.secondary' }}>
                {`${person.email}, `}
              </Link>
            ))}
          </>
        }
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          component: 'span',
          typography: 'caption',
        }}
      /> */}
    </Stack>
  );

  // const renderAttachments = (
  //   <Stack
  //     spacing={1}
  //     sx={{
  //       p: 1,
  //       borderRadius: 1,
  //       bgcolor: 'background.neutral',
  //     }}
  //   >
  //     <Stack direction="row" alignItems="center" justifyContent="space-between">
  //       <ButtonBase
  //         onClick={showAttachments.onToggle}
  //         sx={{ color: 'text.secondary', typography: 'caption', borderRadius: 0.5 }}
  //       >
  //         <Iconify icon="eva:attach-2-fill" sx={{ mr: 0.5 }} />
  //         {mail.attachments.length} attachments
  //         <Iconify
  //           icon={
  //             showAttachments.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
  //           }
  //           width={16}
  //           sx={{ ml: 0.5 }}
  //         />
  //       </ButtonBase>

  //       <Button startIcon={<Iconify icon="eva:cloud-download-fill" />}>Download</Button>
  //     </Stack>

  //     <Collapse in={showAttachments.value} unmountOnExit timeout="auto">
  //       <Stack direction="row" flexWrap="wrap" spacing={1}>
  //         {mail.attachments.map((attachment) => (
  //           <Stack
  //             key={attachment.id}
  //             alignItems="center"
  //             justifyContent="center"
  //             sx={{
  //               width: 40,
  //               height: 40,
  //               flexShrink: 0,
  //               borderRadius: 1,
  //               overflow: 'hidden',
  //               position: 'relative',
  //               backgroundColor: 'background.neutral',
  //             }}
  //           >
  //             <FileThumbnail
  //               tooltip
  //               imageView
  //               file={attachment.preview}
  //               onDownload={() => console.info('DOWNLOAD')}
  //               sx={{ width: 24, height: 24 }}
  //             />
  //           </Stack>
  //         ))}
  //       </Stack>
  //     </Collapse>
  //   </Stack>
  // );

  const renderContent = (
    <Box sx={{ py: 3, overflow: 'hidden', flexGrow: 1 }}>
      <Scrollbar>
        <Markdown
          children={mail.body}
          sx={{
            px: 2,
            '& p': {
              typography: 'body2',
            },
          }}
        />
      </Scrollbar>
    </Box>
  );
  const onClickUpload = () => {
    setOpenUpload(true);
  };
  const onClickViewInvoice = () => {
    sessionStorage.setItem('idInvoice', mail.invoiceId);
    router.push(paths.dashboard.invoice.details(mail.invoiceId));
    // window.open(paths.dashboard.invoice.details(mail.invoiceId), '_blank');
  };
  const renderEditor = (
    <Stack
      spacing={2}
      sx={{
        p: (theme) => theme.spacing(0, 2, 2, 2),
      }}
    >
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" flexGrow={1} />
        {!mail.isIncludedPdf || !mail.isIncludedXml ? (
          <Button
            variant="contained"
            color="primary"
            endIcon={<Iconify icon="solar:export-bold" />}
            onClick={() => onClickUpload()}
          >
            Bổ sung
          </Button>
        ) : (
          mail.invoiceId && (
            <Button
              variant="outlined"
              color="primary"
              endIcon={<Iconify icon="ph:eye" />}
              onClick={onClickViewInvoice}
            >
              Xem hoá đơn
            </Button>
          )
        )}
      </Stack>
    </Stack>
  );
  const resetUpload = () => {
    setOpenUpload(false);
  };
  return (
    <>
      {openUpload && <FileUpload isOpen={openUpload} onCanCel={resetUpload} mail={mail} />}
      <Stack
        flexGrow={1}
        sx={{
          width: 1,
          minWidth: 0,
          borderRadius: 1.5,
          bgcolor: 'background.default',
        }}
      >
        {/* {renderHead} */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderSubject}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderSender}

        {/* {!!mail.attachments.length && <Stack sx={{ px: 2 }}> {renderAttachments} </Stack>} */}

        {renderContent}

        {renderEditor}
      </Stack>
    </>
  );
}
