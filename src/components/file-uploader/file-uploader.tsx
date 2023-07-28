import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  List,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import UploadPage from 'src/app/components/extra/upload/page';
import { getBusinesses, setSelectedBusiness } from 'src/redux/slices/business';
import { getMails } from 'src/redux/slices/mail';
import { useDispatch, useSelector } from 'src/redux/store';
import { IMail } from 'src/types/mail';
import Iconify from '../iconify/iconify';

type Props = {
  mail: IMail;
  onCanCel: () => {};
  isOpen: boolean;
};

export default function FileUpload({ isOpen, onCanCel, mail }: Props) {
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
        sx={{ cursor: "" }}
        onClick={() => onClickCancel()}
      >
        <Iconify icon="material-symbols:close" />
      </DialogTitle>
      <DialogContent sx={{ alignItems: 'end' }}>
        <UploadPage mail={mail} onClickCancel={()=>onClickCancel()}/>
      </DialogContent>
    </Dialog>
  );
}
