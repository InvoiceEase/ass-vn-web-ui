import {
  Avatar,
  DialogActions,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

type Props = {
  businessName: string;
  onClick: () => void;
};

export default function BusinessItem({ businessName, onClick }: Props) {
  return (
    <DialogActions>
      <ListItemButton onClick={onClick}>
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
              {businessName}
            </Typography>
          }
        />
      </ListItemButton>
    </DialogActions>
  );
}
