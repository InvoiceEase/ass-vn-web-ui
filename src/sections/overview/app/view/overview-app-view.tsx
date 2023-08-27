'use client';

// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
// hooks
// _mock
import { _appFeatured } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import {
  getSumTaxAmount,
  getSumTaxAmountStatus,
  getTotalInvoices,
  getTotalPrice,
} from 'src/redux/slices/dashboard';
import { useDispatch, useSelector } from 'src/redux/store';
import AppAreaInstalled from '../app-area-installed';
import AppFeatured from '../app-featured';
import AppWelcome from '../app-welcome';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const businessId = sessionStorage.getItem('orgId');

  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const theme = useTheme();

  const settings = useSettingsContext();

  const {
    totalInvoices,
    totalInvoicesPerMonthDashboardList,
    quarter,
    totalTaxAmountNumber,
    totalTaxAmountNumberStatus,
    months,
    incomeInvoicesTotal,
    outcomeInvoicesTotal,
  } = useSelector((state) => state.dashboard.businessDashboard);

  useEffect(() => {
    dispatch(getTotalInvoices(businessId));
    dispatch(getSumTaxAmount(businessId));
    dispatch(getSumTaxAmountStatus(businessId));
    dispatch(getTotalPrice(businessId));
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Tổng số lượng hoá đơn"
            // percent={0}
            total={+totalInvoices}
            isShowChart
            chart={{
              series: totalInvoicesPerMonthDashboardList,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={`Tổng tiền thuế dự tính phải đóng của quý ${quarter}`}
            // percent={+quarter}
            total={+totalTaxAmountNumber}
            isShowChart={false}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={`Tổng tiền thuế phải đóng cho quý ${quarter}`}
            // percent={29.4}
            total={+totalTaxAmountNumberStatus}
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
          title="Thống kê hóa đơn"
          chart={{
            categories: months,
            series: [
              {
                year: '2019',
                data: [
                  {
                    name: 'HĐ đầu vào',
                    data: incomeInvoicesTotal,
                  },
                  {
                    name: 'HĐ đầu ra',
                    data: outcomeInvoicesTotal,
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
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}

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
