'use client';

// @mui
import Container from '@mui/material/Container';
// routes
// components
import { useSettingsContext } from 'src/components/settings';
import { useParams } from 'src/routes/hook';
//
import { useEffect } from 'react';
import { getInvoiceDetails } from 'src/redux/slices/invoices';
import { useDispatch, useSelector } from 'src/redux/store';
import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();
  const dispatch = useDispatch();

  const params = useParams();

  const { id } = params;

  useEffect(() => {
    dispatch(getInvoiceDetails(id));
  }, []);

  const _invoices = useSelector((state) => state.invoice.invoices);

  const currentInvoiceFromList = _invoices.filter((invoice) => invoice.id === id)[0];

  const currentInvoice = useSelector((state) => state.invoice.invoiceDetails);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading={currentInvoice?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          { name: currentInvoice?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}

      <InvoiceDetails invoice={currentInvoice ?? currentInvoiceFromList} />
    </Container>
  );
}
