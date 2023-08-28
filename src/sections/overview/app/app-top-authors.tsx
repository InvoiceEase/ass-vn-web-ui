import orderBy from 'lodash/orderBy';
// @mui
import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// components
import { Avatar } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type ItemProps = {
  name: string;
  count: number;
  avatarUrl?: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AppTopAuthors({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {orderBy(list, ['totalFavorites'], ['desc']).map((author, index) => (
          <AuthorItem author={author} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type AuthorItemProps = {
  author: ItemProps;
  index: number;
};

function AuthorItem({ author, index }: AuthorItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt="avatar" src={author.avatarUrl}>
        {author.name.charAt(0)}
      </Avatar>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{author.name}</Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Iconify icon="solar:heart-bold" width={14} sx={{ mr: 0.5 }} />
          {fShortenNumber(author.count)}
        </Typography>
      </Box>

      <Iconify
        icon="solar:cup-star-bold"
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      />
    </Stack>
  );
}
