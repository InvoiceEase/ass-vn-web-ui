import { ApexOptions } from 'apexcharts';
// @mui
import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// utils
import { fNumber } from 'src/utils/format-number';
// components
import Chart from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  percent?: number;
  isShowChart?: boolean;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function AppWidgetSummary({
  title,
  percent,
  total,
  chart,
  sx,
  isShowChart,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 100, color: colors[1] },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          {/* <Iconify
              width={24}
              icon={
                percent < 0
                  ? 'solar:double-alt-arrow-down-bold-duotone'
                  : 'solar:double-alt-arrow-up-bold-duotone'
              }
              sx={{
                mr: 1,
                color: 'success.main',
                ...(percent < 0 && {
                  color: 'error.main',
                }),
              }}
            /> */}

          <Typography component="div" variant="subtitle2">
            {/* {percent > 0 && '+'} */}
            {!percent && percent}
            {/* {fPercent(percent)} */}
          </Typography>
        </Stack>

        <Typography variant="h3">{fNumber(total)}</Typography>
      </Box>

      {isShowChart && (
        <Chart
          type="bar"
          series={[{ data: series }]}
          options={chartOptions}
          width={60}
          height={36}
        />
      )}
    </Card>
  );
}
