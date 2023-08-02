import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import { INVOICE_STATUS_OPTIONS } from 'src/_mock';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { IInvoice } from 'src/types/invoice';
import { fCurrency } from 'src/utils/format-number';
import InvoiceToolbar from './invoice-toolbar';

import { Divider } from '@mui/material';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { InvoiceStatusConfig } from './InvoiceStatusConfig';
import InvoiceErrorField from './invoice-error-field';
import InvoiceInfoField from './invoice-info-field';

// @mui

// utils

// _mock

// types

// components

//

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  invoice: IInvoice;
};

export default function InvoiceDetails({ invoice }: Props) {
  const [currentStatus, setCurrentStatus] = useState(invoice?.status);

  const handleChangeStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value);
  }, []);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(invoice?.subTotal)}
        </TableCell>
      </StyledTableRow>

      {/* <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Shipping</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-invoice?.shipping)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Discount</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-invoice?.discount)}
        </TableCell>
      </StyledTableRow> */}

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Taxes</TableCell>
        <TableCell width={120}>{fCurrency(invoice?.taxAmountTotal)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(invoice?.totalPrice)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@minimals.cc</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Description</TableCell>

              <TableCell>Qty</TableCell>

              <TableCell align="right">Unit price</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          {/* <TableBody>
            {invoice?.items.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row.title}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.description}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.quantity}</TableCell>

                <TableCell align="right">{fCurrency(row.price)}</TableCell>

                <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody> */}
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  const [invoicePDFUrl, setInvoicePDFUrl] = useState('');

  const getInvoicePDF = () => {
    // Create a reference to the file we want to download
    const storage = getStorage();
    const starsRef = ref(storage, 'FUck/1C23TPL_00000046.pdf');

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        console.log('NghiaLog: url - ', url);
        setInvoicePDFUrl(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            console.log('NghiaLog: error - ', error);
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log('NghiaLog: error - ', error);
            break;
          case 'storage/canceled':
            // User canceled the upload
            console.log('NghiaLog: error - ', error);
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('NghiaLog: error - ', error);
            break;

          default:
            break;
        }
      });
  };

  useEffect(() => {
    getInvoicePDF();
  }, []);

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={currentStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <h1>Chi tiết hoá đơn</h1>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          <Box component="div">
            <iframe title="pdf-viewer" src={invoicePDFUrl} width="400px" height="620px" />
          </Box>
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row">
            <Stack width="320px" sx={{ mr: 4 }}>
              <Box sx={{ typography: 'body2', mb: 10 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Đơn vị bán hàng
                </Typography>
                {invoice?.senderName}
                <br />
                {invoice?.senderAddress}
                <br />
                MST: {invoice?.senderTaxcode}
                <br />
              </Box>

              <Box sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Đơn vị mua hàng
                </Typography>
                {invoice?.receiverName}
                <br />
                {invoice?.receiverAddress}
                <br />
                MST: {invoice?.receiverTaxCode}
                <br />
              </Box>
              <Stack
                width="185%"
                style={{ backgroundColor: '#00B8D91A' }}
                sx={{ mt: 5, p: 2, borderRadius: 1 }}
              >
                <Typography variant="h5" sx={{ mb: 1 }} color="#006C9C">
                  KẾT QUẢ KIỂM TRA HOÁ ĐƠN
                </Typography>
                <Stack direction="row">
                  <Box sx={{ mr: 3 }}>
                    {invoice?.errorFieldList?.split(',').map((item) => {
                      return <InvoiceErrorField type={item} />;
                    })}
                  </Box>
                  <Box>
                    <InvoiceInfoField invoiceSerial={invoice?.invoiceSerial} />
                    <InvoiceInfoField isSigned={invoice?.invoiceSerial?.charAt(1) === 'K'} />
                    <InvoiceInfoField invoiceCharacter={invoice?.invoiceCharacter} />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={1} direction="column">
              <Label
                variant="soft"
                color={
                  (currentStatus === InvoiceStatusConfig.approved.status &&
                    InvoiceStatusConfig.approved.color) ||
                  (currentStatus === InvoiceStatusConfig.authenticated.status &&
                    InvoiceStatusConfig.authenticated.color) ||
                  (currentStatus === InvoiceStatusConfig.unapproved.status &&
                    InvoiceStatusConfig.unapproved.color) ||
                  (currentStatus === InvoiceStatusConfig.unauthenticated.status &&
                    InvoiceStatusConfig.unauthenticated.color) ||
                  (currentStatus === InvoiceStatusConfig.wrong.status &&
                    InvoiceStatusConfig.wrong.color) ||
                  'default'
                }
              >
                {currentStatus}
              </Label>
              <Box sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Thông tin hoá đơn
                </Typography>
                Kí hiệu: {invoice?.invoiceSerial}
                <br />
                Số: {invoice?.invoiceNumber}
                <br />
                Ngày hoá đơn: {formatDate(invoice?.invoiceCreatedDate)}
                <br />
                Ngày nhận: {formatDate(invoice?.invoiceCreatedDate)}
                <br />
              </Box>
              <Divider style={{ marginBottom: 10, marginTop: 10 }} color="primary" />
              <Box sx={{ typography: 'body2' }}>
                Tổng tiền trước thuế: {fCurrency(invoice?.subTotal)}
                <br />
                Tiền thuế GTGT: {fCurrency(invoice?.taxAmountTotal)}
                <br />
                Tổng tiền thanh toán: {fCurrency(invoice?.totalPrice)}
                <br />
              </Box>
            </Stack>
          </Stack>

          {/* {renderList} */}

          {/* <Divider sx={{ mt: 5, borderStyle: 'dashed' }} /> */}

          {/* {renderFooter} */}
        </Stack>
      </Card>
    </>
  );
}
