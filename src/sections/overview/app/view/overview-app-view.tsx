'use client';

// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
// hooks
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { RoleCodeEnum } from 'src/enums/RoleCodeEnum';
import {
  getNumInvoices,
  getNumMails,
  getSumTaxAmountIncome,
  getSumTaxAmountOutcome,
  getTopAuditors,
  getTopBusinesses,
  getTotalInvoices,
  getTotalPrice,
  getTotalStat,
} from 'src/redux/slices/dashboard';
import { useDispatch, useSelector } from 'src/redux/store';
import AppAreaInstalled from '../app-area-installed';
import AppTopAuthors from '../app-top-authors';
import AppWelcome from '../app-welcome';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const businessId = sessionStorage.getItem('orgId');

  const roleCode = sessionStorage.getItem('roleCode');

  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const theme = useTheme();

  const settings = useSettingsContext();

  const {
    totalInvoices,
    totalInvoicesPerMonthDashboardList,
    totalTaxAmountIncome,
    totalTaxAmountOutcome,
    months,
    incomeInvoicesTotal,
    outcomeInvoicesTotal,
  } = useSelector((state) => state.dashboard.businessDashboard);

  const {
    totalAuditors,
    totalBusinesses,
    totalUsers,
    monthsAdmin,
    totalNumMails,
    totalNumInvoices,
    topBusinesses,
    topAuditors,
  } = useSelector((state) => state.dashboard.adminDashboard);

  useEffect(() => {
    if (roleCode?.includes(RoleCodeEnum.BusinessPrefix)) {
      dispatch(getTotalInvoices(businessId));
      dispatch(getSumTaxAmountIncome(businessId));
      dispatch(getSumTaxAmountOutcome(businessId));
      dispatch(getTotalPrice(businessId));
    } else if (roleCode?.includes(RoleCodeEnum.Admin)) {
      dispatch(getTotalStat());
      dispatch(getNumInvoices());
      dispatch(getNumMails());
      dispatch(getTopBusinesses());
      dispatch(getTopAuditors());
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={8}> */}
        <AppWelcome
          title={`Xin chào 👋 \n ${user?.displayName}`}
          description="Chào mừng bạn đến với hệ thống quản lý và lưu trữ hoá đơn. Chúc bạn có một trải nghiệm tuyệt vời!"
          img={<SeoIllustration />}
          // action={
          //   <Button variant="contained" color="primary">
          //     Go Now
          //   </Button>
          // }
        />
        {/* </Grid> */}

        {/* <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={
              roleCode?.includes(RoleCodeEnum.Admin)
                ? 'Tổng số lượng doanh nghiệp'
                : 'Tổng số lượng hoá đơn'
            }
            // percent={0}
            total={roleCode?.includes(RoleCodeEnum.Admin) ? +totalBusinesses : +totalInvoices}
            isShowChart={!roleCode?.includes(RoleCodeEnum.Admin)}
            chart={{
              series: totalInvoicesPerMonthDashboardList,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={
              roleCode?.includes(RoleCodeEnum.Admin)
                ? 'Tổng số lượng người dùng'
                : `Tổng VAT dự tính của hóa đơn đầu vào của quý ${totalTaxAmountIncome.quarter}`
            }
            // percent={+quarter}
            total={
              roleCode?.includes(RoleCodeEnum.Admin)
                ? +totalUsers
                : +totalTaxAmountIncome.totalTaxAmountNumber
            }
            isShowChart={false}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={
              roleCode?.includes(RoleCodeEnum.Admin)
                ? 'Tổng số lượng kiểm duyệt viên'
                : `Tổng VAT dự tính của hoá đơn đầu ra của quý ${totalTaxAmountOutcome.quarter}`
            }
            // percent={29.4}
            total={
              roleCode?.includes(RoleCodeEnum.Admin)
                ? +totalAuditors
                : +totalTaxAmountOutcome.totalTaxAmountNumber
            }
            isShowChart={false}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Tổng số lượng hóa đơn"
            chart={{
              series: [
                { label: 'Nhà cung cấp A', value: 12244 },
                { label: 'Nhà cung cấp B', value: 53345 },
                { label: 'Nhà cung cấp C', value: 44313 },
                { label: 'Nhà cung cấp D', value: 78343 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}> */}
        <AppAreaInstalled
          sx={{ width: '100%' }}
          title={
            roleCode?.includes(RoleCodeEnum.Admin)
              ? 'Thống kê tài nguyên lưu trữ ở hệ thống'
              : 'Thống kê giá trị hóa đơn'
          }
          chart={{
            categories: roleCode?.includes(RoleCodeEnum.Admin) ? monthsAdmin : months,
            series: [
              {
                data: [
                  {
                    name: roleCode?.includes(RoleCodeEnum.Admin)
                      ? 'Tổng số lượng mail'
                      : 'HĐ đầu vào',
                    data: roleCode?.includes(RoleCodeEnum.Admin)
                      ? totalNumMails
                      : incomeInvoicesTotal,
                  },
                  {
                    name: roleCode?.includes(RoleCodeEnum.Admin)
                      ? 'Tổng số lượng hoá đơn'
                      : 'HĐ đầu ra',
                    data: roleCode?.includes(RoleCodeEnum.Admin)
                      ? totalNumInvoices
                      : outcomeInvoicesTotal,
                  },
                ],
              },
            ],
          }}
        />
        {/* </Grid> */}

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid> */}

        {roleCode?.includes(RoleCodeEnum.Admin) && (
          <Grid xs={12} md={6} lg={6}>
            <AppTopAuthors
              title="Những doanh nghiệp có tổng số lượng hoá đơn nhiều nhất"
              list={topBusinesses}
            />
          </Grid>
        )}

        {roleCode?.includes(RoleCodeEnum.Admin) && (
          <Grid xs={12} md={6} lg={6}>
            <AppTopAuthors
              title="Những kiểm duyệt viên được nhiều doanh nghiệp chọn nhất"
              list={topAuditors}
            />
          </Grid>
        )}

        {/* <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
