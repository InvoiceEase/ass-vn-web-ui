import { Dialog, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'src/redux/store';
import UploadView from 'src/sections/_examples/extra/upload-view';
import { IMail } from 'src/types/mail';
import Iconify from '../iconify/iconify';

type Props = {
  mail?: IMail;
  isUploadInvoice?: boolean;
  onCanCel: () => void;
  isOpen: boolean;
};

export default function FileUpload({ isOpen, onCanCel, mail, isUploadInvoice }: Props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');

  const onClickCancel = () => {
    setOpen(false);
    onCanCel();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, []);

  return (
    <Dialog
      open={open}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        align="right"
        sx={{ cursor: '' }}
        onClick={() => onClickCancel()}
      >
        <Iconify icon="material-symbols:close" />
      </DialogTitle>
      <DialogContent sx={{ alignItems: 'end' }}>
        <UploadView mail={mail} onClickCancel={onClickCancel} isUploadInvoice />
      </DialogContent>
    </Dialog>
  );
}
