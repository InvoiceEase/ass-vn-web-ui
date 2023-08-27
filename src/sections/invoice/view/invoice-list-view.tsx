'use client';

import sumBy from 'lodash/sumBy';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
// types
import { IInvoice, IInvoiceTableFilters, IInvoiceTableFilterValue } from 'src/types/invoice';
// components
import { isDateError } from 'src/components/custom-date-range-picker';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
//
import axios from 'axios';
import { saveAs } from 'file-saver';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { keyBy } from 'lodash';
import FileUpload from 'src/components/file-uploader/file-uploader';
import { useSnackbar } from 'src/components/snackbar';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import { getInvoices } from 'src/redux/slices/invoices';
import { useDispatch, useSelector } from 'src/redux/store';
import { API_ENDPOINTS } from 'src/utils/axios';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import { InvoiceStatusConfig } from '../InvoiceStatusConfig';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceName', label: 'Tên hoá đơn' },
  { id: 'invoiceCreatedDate', label: 'Ngày lập' },
  { id: 'totalPrice', label: 'Thành tiền' },
  { id: 'invoiceCharacter', label: 'Tính chất hoá đơn' },
  { id: 'status', label: 'Trạng thái' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
  attribute: '',
};

function useInitial() {
  const dispatch = useDispatch();

  const orgId = sessionStorage.getItem('orgId');
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID') ?? '0';
  const roleCode = sessionStorage.getItem('roleCode') ?? '';

  const getInvoicessCallback = useCallback(async () => {
    await dispatch(
      getInvoices(roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId ?? '', true)
    );
  }, [dispatch]);

  useEffect(() => {
    getInvoicessCallback();
  }, [getInvoicessCallback, orgId, selectedBusinessID]);

  return null;
}

// ----------------------------------------------------------------------

export default function InvoiceListView({ isInputInvoice }: { isInputInvoice: boolean }) {
  // useInitial();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const orgId = sessionStorage.getItem('orgId');
  const selectedBusinessID = sessionStorage.getItem('selectedBusinessID') ?? '0';
  const roleCode = sessionStorage.getItem('roleCode') ?? '';

  const getInvoicessCallback = useCallback(async () => {
    await dispatch(
      getInvoices(roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId ?? '', true)
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getInvoices(roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId ?? '', true)
    );
  }, [getInvoicessCallback, orgId, selectedBusinessID]);
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const _invoices = useSelector((state) => state.invoice.invoices);

  const loading = useSelector((state) => state.invoice.invoicesStatus.loading);

  const [tableData, setTableData] = useState(_invoices);
  const [invoiceCharacter, setInvoiceCharacter] = useState(['']);

  useEffect(() => {
    setTableData(_invoices);
    const invoiceCharacterLst : string[] = [];
    _invoices.forEach((item)=>{
      if (!invoiceCharacterLst.includes(item.invoiceCharacter)) {
        invoiceCharacterLst.push(item.invoiceCharacter);
      }
      setInvoiceCharacter(invoiceCharacterLst);
    })
  }, [_invoices]);

  const [openUpload, setOpenUpload] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [xmlDownloadInvoices, setXmlDownloadInvoices] = useState<
    { invoiceName: string; xmlFilePathList: string[] }[]
  >([]);
  const handleUpload = () => {
    setOpenUpload(true);
  };
  const resetUpload = () => {
    setOpenUpload(false);
  };
  const dateError = isDateError(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: _invoices,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = useCallback(
    (status: string) => tableData.filter((item) => item.status === status).length,
    [tableData]
  );

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'default', count: tableData.length },
    {
      value: InvoiceStatusConfig.notAuthenticated.status,
      label: InvoiceStatusConfig.notAuthenticated.status,
      color: InvoiceStatusConfig.notAuthenticated.color,
      count: getInvoiceLength(InvoiceStatusConfig.notAuthenticated.status),
    },
    {
      value: InvoiceStatusConfig.unauthenticated.status,
      label: InvoiceStatusConfig.unauthenticated.status,
      color: InvoiceStatusConfig.unauthenticated.color,
      count: getInvoiceLength(InvoiceStatusConfig.unauthenticated.status),
    },
    {
      value: InvoiceStatusConfig.authenticated.status,
      label: InvoiceStatusConfig.authenticated.status,
      color: InvoiceStatusConfig.authenticated.color,
      count: getInvoiceLength(InvoiceStatusConfig.authenticated.status),
    },
    {
      value: InvoiceStatusConfig.approved.status,
      label: InvoiceStatusConfig.approved.status,
      color: InvoiceStatusConfig.approved.color,
      count: getInvoiceLength(InvoiceStatusConfig.approved.status),
    },
    {
      value: InvoiceStatusConfig.unapproved.status,
      label: InvoiceStatusConfig.unapproved.status,
      color: InvoiceStatusConfig.unapproved.color,
      count: getInvoiceLength(InvoiceStatusConfig.unapproved.status),
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IInvoiceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderEditor = (
    <Stack direction="row" alignItems="center" sx={{ marginTop: 3 }}>
      <Stack direction="row" alignItems="center" flexGrow={1} />

      <Button
        variant="outlined"
        color="primary"
        endIcon={<Iconify icon="iconamoon:send-fill" />}
        onClick={() => handleUpload()}
      >
        Xác thực
      </Button>
    </Stack>
  );
  useEffect(() => {
    setOpenUpload(false);
  }, []);

  const onDownloadFiles = (cloudFilePath: string, fileName: string) => {
    if (!cloudFilePath) {
      return;
    }
    // Create a reference to the file we want to download
    const storage = getStorage();
    // selected.map((fileId) => {
    //   const file = files.filter((fileInState) => fileInState.id === fileId)[0];
    const starsRef = ref(storage, cloudFilePath);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
          saveAs(blob, fileName);
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;

          default:
            break;
        }
      });
    // });
  };

  const onExportInvoice = async (listInvoiceId: string[]) => {
    const invoicesById = keyBy(dataFiltered, 'id');
    listInvoiceId.map((id) => {
      onDownloadFiles(invoicesById[+id].xmlFilePathList[0], invoicesById[+id].invoiceName);
      // setXmlDownloadInvoices((prevState) => [
      //   ...prevState,
      //   {
      //     invoiceName: invoicesById[+id].invoiceName,
      //     xmlFilePathList: invoicesById[+id].xmlFilePathList,
      //   },
      // ]);
    });
    // xmlDownloadInvoices.forEach((item) =>
    //   onDownloadFiles(item.xmlFilePathList[0], item.invoiceName)
    // );
    // console.log('NghiaLog: xmlDownloadPath - ', xmlDownloadPaths);
    // const listInvoiceIdNumber: number[] = [];
    // listInvoiceId.forEach((id) => listInvoiceIdNumber.push(+id));

    // const token = sessionStorage.getItem('token');

    // const accessToken: string = `Bearer ${token}`;

    // const headersList = {
    //   accept: '*/*',
    //   Authorization: accessToken,
    // };
    // try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.invoice.export}`,
    //     {
    //       version: 0,
    //       invoiceIdList: listInvoiceIdNumber,
    //     },
    //     {
    //       headers: headersList,
    //     }
    //   );
    //   // if (response.status === 200) {
    //   // }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const onApproveInvoice = async (listInvoiceId: string[]) => {
    console.log('NghiaLog: listInvoiceId - ', listInvoiceId);
    const token = sessionStorage.getItem('token');

    const accessToken: string = `Bearer ${token}`;

    const headersList = {
      accept: '*/*',
      Authorization: accessToken,
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BE_ADMIN_API}${API_ENDPOINTS.invoice.details}status`,
        {
          version: 0,
          invoiceIds: listInvoiceId,
          invoiceStatus: 'DA_DUYET',
        },
        {
          headers: headersList,
        }
      );
      if (response.status === 200) {
        enqueueSnackbar('Duyệt hoá đơn thành công!');
        handleResetFilters();
        dispatch(
          getInvoices(
            roleCode?.includes(RoleCodeEnum.Auditor) ? selectedBusinessID : orgId ?? '',
            true
          )
        );
      } else {
        enqueueSnackbar('Duyệt hoá đơn thất bại!', { variant: 'error' });
      }
    } catch (error) {
      // dispatch(slice.actions.getInvoiceDetailsFailure(error));
      console.log(error);
    }
  };

  return (
    <>
      {openUpload && <FileUpload isOpen={openUpload} onCanCel={resetUpload} />}
      {/* <Container maxWidth={settings.themeStretch ? false : 'lg'}> */}
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <InvoiceTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          serviceOptions={invoiceCharacter}
        />

        {canReset && (
          <InvoiceTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <Stack direction="row">
                {/* <Tooltip title="Sent"> */}
                <Button
                  color="primary"
                  onClick={() => {
                    onExportInvoice(table.selected);
                  }}
                  sx={{ mr: 1 }}
                >
                  <Iconify icon="solar:import-bold" sx={{ mr: 0.5 }} />
                  Xuất hoá đơn
                </Button>
                {filters.status === 'Đã xác thực' ||
                  (filters.status === 'Chưa xác thực' && table.selected && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onApproveInvoice(table.selected);
                      }}
                    >
                      {/* <Iconify icon="solar:import-bold" sx={{ mr: 0.5 }} /> */}
                      Duyệt hoá đơn
                    </Button>
                  ))}
                {/* </Tooltip> */}

                {/* <Tooltip title="Download">
                  <IconButton color="primary">
                    <Iconify icon="eva:download-outline" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Print">
                  <IconButton color="primary">
                    <Iconify icon="solar:printer-minimalistic-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip> */}
              </Stack>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      isInputInvoice={isInputInvoice}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                {_invoices.length === 0 && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      {/* {renderEditor} */}
      {/* </Container> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IInvoice[];
  comparator: (a: any, b: any) => number;
  filters: IInvoiceTableFilters;
  dateError: boolean;
}) {
  const { name, status, service, startDate, endDate, attribute } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.senderName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if(attribute && attribute!==''){
    inputData = inputData.filter((invoice) => invoice.invoiceCharacter === attribute);
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (invoice) =>
          fTimestamp(invoice.invoiceCreatedDate) >= fTimestamp(startDate) &&
          fTimestamp(invoice.invoiceCreatedDate) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
