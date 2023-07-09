// @mui
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IMailListState } from 'src/types/mail';
// components
//
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useDispatch } from 'src/redux/store';
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

  const dispatch = useDispatch();

  const totalMailPage = sessionStorage.getItem('totalMailPage');
  const currentMailPage = sessionStorage.getItem('currentMailPage');
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID');
  const businessSearchQuery = sessionStorage.getItem('businessSearchQuery');

  const renderContent = (
    <Scrollbar
      sx={{ px: 2 }}
      onScroll={() => {
        console.log('NghiaLog: hehe');
      }}
    >
      {/* <InfiniteScroll
        dataLength={10}
        hasMore={totalMailPage ? +totalMailPage > 1 : false}
        loader={<h4>Loading...</h4>}
        next={() => {
          if (businessSearchQuery && currentMailPage) {
            dispatch(getMails(selectedBusinessID, businessSearchQuery, +currentMailPage + 1));
          }
        }}
      > */}
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
      {/* </InfiniteScroll> */}
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
