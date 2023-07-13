// @mui
import Box from '@mui/material/Box';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// types
import { IMail } from 'src/types/mail';

// ----------------------------------------------------------------------

type Props = ListItemButtonProps & {
  mail: IMail;
  selected: boolean;
  onClickMail: VoidFunction;
};

export default function MailItem({ mail, selected, onClickMail, sx, ...other }: Props) {
  return (
    <ListItemButton
      onClick={onClickMail}
      sx={{
        p: 1,
        mb: 0.5,
        borderRadius: 1,
        // eslint-disable-next-line no-nested-ternary
        ...(selected
          ? {
              bgcolor: 'action.selected',
            }
          : !(mail.isIncludedPdf || mail.isIncludedXml)
          ? { bgcolor: '#FCF7E5' }
          : { bgcolor: 'white' }),
        ...sx,
      }}
      {...other}
    >
      {/* <Avatar alt={mail.mailFrom} src={`${mail.from.avatarUrl}`} sx={{ mr: 2 }}>
        {mail.mailFrom.charAt(0).toUpperCase()}
      </Avatar> */}

      <>
        <ListItemText
          primary={mail.mailFrom}
          primaryTypographyProps={{
            noWrap: true,
            variant: 'subtitle2',
          }}
          secondary={mail.body}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
            variant: mail.isRead ? 'body2' : 'subtitle2',
            color: mail.isRead ? 'text.secondary' : 'text.primary',
          }}
        />

        <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
          <Typography
            noWrap
            variant="body2"
            component="span"
            sx={{
              mb: 1.5,
              fontSize: 12,
              color: '#C69E59',
            }}
          >
            {!(mail.isIncludedPdf || mail.isIncludedXml) && 'Cần bổ sung file'}
          </Typography>

          {!mail.isRead && (
            <Box sx={{ bgcolor: 'info.main', width: 8, height: 8, borderRadius: '50%' }} />
          )}
        </Stack>
      </>
    </ListItemButton>
  );
}
