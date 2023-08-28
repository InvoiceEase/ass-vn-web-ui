import { ApexOptions } from 'apexcharts';
// @mui
import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
// components
import Chart, { useChart } from 'src/components/chart';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[][];
    series: {
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function AppAreaInstalled({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const popover = usePopover();

  // const [seriesData, setSeriesData] = useState();

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  // const handleChangeSeries = useCallback(
  //   (newValue: string) => {
  //     popover.onClose();
  //     setSeriesData(newValue);
  //   },
  //   [popover]
  // );

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        {series.map((item) => (
          <Box sx={{ mt: 3, mx: 3 }}>
            <Chart dir="ltr" type="line" series={item.data} options={chartOptions} height={364} />
          </Box>
        ))}
      </Card>

      {/* <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </>
  );
}
