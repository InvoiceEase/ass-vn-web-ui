// @mui
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IMailListState } from 'src/types/mail';
// components
//
import { useState } from 'react';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { TablePaginationCustom } from 'src/components/table';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { getMails } from 'src/redux/slices/mail';
import { useDispatch, useSelector } from 'src/redux/store';
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

  const [localPage, setLocalPage] = useState(0);

  const roleCode = sessionStorage.getItem('roleCode');
  const totalMailPage = sessionStorage.getItem('totalMailPage');
  const currentMailPage = sessionStorage.getItem('currentMailPage');
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID');
  const orgId = sessionStorage.getItem('orgId');
  const businessSearchQuery = sessionStorage.getItem('businessSearchQuery');

  const { numberOfElements, page, totalElements, totalPages } = useSelector(
    (state) => state.mail.pagination
  );

  const renderContent = (
    <>
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
      {!loading && (
        <TablePaginationCustom
          count={totalElements}
          page={page}
          rowsPerPage={10}
          onPageChange={(event, changedPage) => {
            dispatch(
              getMails(
                roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId,
                businessSearchQuery,
                changedPage
              )
            );
          }}
          // backIconButtonProps={{
          //   onClick: () => {
          //     if (localPage > 0) {
          //       setLocalPage(localPage - 1);
          //     }
          //   },
          // }}
          // nextIconButtonProps={{
          //   onClick: () => {
          //     if (localPage <= totalPages) setLocalPage(localPage + 1);
          //   },
          // }}
          onRowsPerPageChange={() => {}}
        />
      )}
    </>
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
