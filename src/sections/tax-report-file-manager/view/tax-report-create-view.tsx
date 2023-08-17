'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useSelector } from 'src/redux/store';
import { useParams } from 'src/routes/hook';
import { ITaxFile } from 'src/types/tax';
import TaxReportNewEditForm from '../tax-report-new-edit-form';
//

// ----------------------------------------------------------------------

export default function TaxReportCreateView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { year, quarter } = params;

  const [files, setFiles] = useState<ITaxFile[]>([]);

  const filesInRedux = useSelector((state) => state.tax.files);

  useEffect(() => {
    if (params) {
      const updateFiles = filesInRedux.filter(
        (item) => item.year === year && item.quarter === quarter
      );
      setFiles(updateFiles);
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: 'New user' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TaxReportNewEditForm year={year} quarter={quarter} files={files} />
    </Container>
  );
}
