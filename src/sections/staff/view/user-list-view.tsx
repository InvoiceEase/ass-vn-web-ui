'use client';

import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';

// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// types
import { IUserTableFiltersAdmin, IUserTableFilterValue } from 'src/types/profile';
// _mock
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
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
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getAuditorForBusiness } from 'src/redux/slices/auditor';
import { useDispatch, useSelector } from 'src/redux/store';
import { IAuditor } from 'src/types/auditor';
import UserTableRow from 'src/sections/staff/user-table-row';
import UserTableToolbar from 'src/sections/staff/user-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 300 },
  { id: 'phoneNumber', label: 'Phone Number', width: 180 },
  // { id: 'email', label: 'Email', width: 300 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: '',
  status: 'All',
};

export default function AuditorsListView() {
  const dispatch = useDispatch();
  const businessId = sessionStorage.getItem('orgId') ?? 0;
  useEffect(() => {
    dispatch(getAuditorForBusiness(+businessId));
  }, []);
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const _userList = useSelector((state) => state.auditor.auditors);
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState(_userList);
  const [role, setRole] = useState(['']);
  const userStatus = ['All', 'Active', 'Banned'];
  useEffect(() => {
    setTableData(_userList);
    const userRole: string[] = [];
    _userList.forEach((item) => {
      if (!userRole.includes(item.roleName)) {
        userRole.push(item.roleName);
      }
    });
    setRole(userRole);
  }, [_userList]);
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
    async (id: string) => {
      const resetedUser = _userList.filter((item) => item.id === id);
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      try {
        const req = {
          version: 0,
          userId: Number(resetedUser[0].id),
          firebaseUserId: resetedUser[0].firebaseUserId,
          status: 'BANNED',
        };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BE_ADMIN_API}/api/v1/users/status?version=${req.version}&userId=${req.userId}&firebaseUserId=${req.firebaseUserId}&status=${req.status}`,
          {},
          { headers: headersList }
        );
        if (response.status === 200) {
          enqueueSnackbar('Đã cấm người dùng thành công');
          router.replace(paths.dashboard.user.list);
        }
      } catch (e) {
        confirm.onFalse();
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handeResetRow = useCallback(
    async (id: string) => {
      const resetedUser = _userList.filter((item) => item.id === id);
      const token = sessionStorage.getItem('token');
      const accessToken: string = `Bearer ${token}`;
      const headersList = {
        accept: '*/*',
        Authorization: accessToken,
      };
      try {
        const req = {
          version: 0,
          userId: Number(resetedUser[0].id),
          firebaseUserId: Number(resetedUser[0].firebaseUserId),
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
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleSelectRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.detail(id));
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
        <Card>
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={role}
          />

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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
  inputData: IAuditor[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFiltersAdmin;
}) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) =>
        user.userFullName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'All') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.roleName));
  }

  return inputData;
}
