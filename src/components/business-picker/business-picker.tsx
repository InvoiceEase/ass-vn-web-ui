import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  List,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getBusinesses, setSelectedBusiness } from 'src/redux/slices/business';
import { useDispatch, useSelector } from 'src/redux/store';
import BusinessItem from './business-item';

export default function BusinessPicker() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const businesses = useSelector((state) => state.business.businesses);
  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  const onClick = (id: string) => {
    setOpen(false);
    sessionStorage.setItem('selectedBusinessID', id);
    dispatch(setSelectedBusiness(businesses.byId[id]));
  };

  useEffect(() => {
    dispatch(getBusinesses());
    setOpen(true);
  }, []);

  return (
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
            {businesses.allIds.map((id: string) => (
              <BusinessItem businessName={businesses.byId[id].name} onClick={() => onClick(id)} />
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
