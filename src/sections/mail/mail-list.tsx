// @mui
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IMailListState } from 'src/types/mail';
// components
import Scrollbar from 'src/components/scrollbar';
//
import MailItem from './mail-item';
import { MailItemSkeleton } from './mail-skeleton';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  mails: IMailListState;
  //
  openMail: boolean;
  onCloseMail: VoidFunction;
  onClickMail: (id: string) => void;
  //
  currentLabel: string;
  selectedMail: (id: string) => boolean;
};

export default function MailList({
  loading,
  mails,
  //
  openMail,
  onCloseMail,
  onClickMail,
  //
  currentLabel,
  selectedMail,
}: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Scrollbar sx={{ px: 2 }}>
      {(loading ? [...Array(8)] : mails.allIds).map((mailId, index) =>
        mailId ? (
          <MailItem
            key={mailId}
            mail={mails.byId[mailId]}
            selected={selectedMail(mailId)}
            onClickMail={() => {
              onCloseMail();
              onClickMail(mailId);
            }}
          />
        ) : (
          <MailItemSkeleton key={index} />
        )
      )}
    </Scrollbar>
  );

  return mdUp ? (
    <>{renderContent}</>
  ) : (
    <Drawer
      open={openMail}
      onClose={onCloseMail}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: 320,
        },
      }}
    >
      {renderContent}
    </Drawer>
  );
}
