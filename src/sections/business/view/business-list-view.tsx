'use client';

import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

// routes
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// types
import { IUserTableFiltersAdmin, IUserTableFilterValue } from 'src/types/profile';
// _mock
import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
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
import Typography from '@mui/material/Typography';
import { getAuditors } from 'src/redux/slices/auditor';
import { useDispatch, useSelector } from 'src/redux/store';
import { IAuditor } from 'src/types/auditor';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getBusinesses, getBusinessesAdmin } from 'src/redux/slices/business';
import { IBusiness, IBusinessAdmin, IBusinessTableFiltersAdmin } from 'src/types/business';
import BusinessTableToolbar from '../business-table-toolbar';
import BusinessTableRow from '../business-table-row';
import BusinessTableFiltersResult from '../business-table-filters-result';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên doanh nghiệp', width: 300 },
  { id: 'representPersonName', label: 'Người đại diện', width: 180 },
  { id: 'taxNumber', label: 'Mã số thuế', width: 180 },
  { id: 'invoiceReceivedEmail', label: 'Mail nhận hóa đơn', width: 100 },
  { id: 'status', label: 'Trạng thái', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  email: '',
  representPersonName: '',
  status: 'All',
};

export default function BusinessListView() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBusinessesAdmin());
  }, []);
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();
  const bizStatus = ['All', 'Active', 'Banned'];

  const confirm = useBoolean();
  const _businessList = useSelector((state) => state.business.businessAdmin);
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState(_businessList);
  useEffect(() => {
    setTableData(_businessList);
  }, [_businessList]);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  // const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string, isActive: boolean) => {
      const resetedBusiness = _businessList.filter((item) => item.id === id);
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/businesses/${Number(
            resetedBusiness[0].id
          )}/status`,
          {
            version: 0,
            // firebaseUserId: resetedUser[0].firebaseUserId,
            status: isActive ? 'ACTIVE' : 'BANNED',
          },
          { headers: headersList }
        );
        if (response.status === 200) {
          const msgSts = isActive
            ? 'Đã kích hoạt doanh nghiệp thành công'
            : 'Đã vô hiệu hóa doanh nghiệp thành công';
          enqueueSnackbar(msgSts);
          dispatch(getBusinessesAdmin());
        }
      } catch (e) {
        enqueueSnackbar('Vô hiệu hóa thất bại', { action: 'error' });
        confirm.onFalse();
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handeResetRow = useCallback(
    async (id: string) => {
      // const resetedUser = _userList.filter((item) => item.id === id);
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      try {
        const req = {
          version: 0,
          // userId: Number(resetedUser[0].id),
          // firebaseUserId: Number(resetedUser[0].firebaseUserId),
          status: 'BANNED',
        };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/users/status`,
          {
            data: req,
            headers: headersList,
          }
        );
        if (response.status === 200) {
          router.refresh();
        }
      } catch (e) {
        confirm.onFalse();
      }
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
      router.push(paths.dashboard.business.edit(id));
    },
    [router]
  );

  const handleSelectRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.business.detail(id));
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Typography sx={{ mb: 5, flexGrow: 1 }} variant="h4">
            Quản lí doanh nghiệp
          </Typography>
          {/* <Button
            sx={{ mb: 5 }}
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Thêm Doanh Nghiệp
          </Button> */}
        </Stack>
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              display: 'flex',
              position: 'static',
            }}
          >
            {bizStatus.map((tab) => (
              <Tab
                key={tab}
                iconPosition="end"
                value={tab}
                label={tab}
                icon={
                  <Label
                    variant={((tab === 'All' || tab === filters.status) && 'filled') || 'soft'}
                    color={
                      (tab === 'Active' && 'success') || (tab === 'Banned' && 'error') || 'default'
                    }
                  >
                    {tab === 'All' && _businessList.length}
                    {tab === 'Active' &&
                      _businessList.filter((biz) => biz.status === 'Active').length}

                    {tab === 'Banned' &&
                      _businessList.filter((biz) => biz.status === 'Banned').length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <BusinessTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
          />

          {/* {canReset && (
            <BusinessTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

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
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                      <BusinessTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id, false)}
                        onActiveRow={() => handleDeleteRow(row.id, true)}
                        onEditRow={() => handleEditRow(row.id)}
                        onResetRow={() => handeResetRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
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
            // dense={table.dense}
            // onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

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

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IBusinessAdmin[];
  comparator: (a: any, b: any) => number;
  filters: IBusinessTableFiltersAdmin;
}) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (biz) =>
        biz.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        biz.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== 'All') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
