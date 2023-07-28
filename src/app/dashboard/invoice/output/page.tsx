'use client';

// sections
import { useEffect } from 'react';
import { getInvoices } from 'src/redux/slices/invoices';
import { useDispatch } from 'src/redux/store';
import { InvoiceListView } from 'src/sections/invoice/view';

export default function InvoiceListPage() {
  const dispatch = useDispatch();
  const orgId = sessionStorage.getItem('orgId');
  useEffect(() => {
    dispatch(getInvoices(orgId ?? '', true));
  }, []);
  return <InvoiceListView isInputInvoice={false} />;
}
