import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { resetFormStep, setFormStep, updateProfileData } from 'src/redux/slices/profile';
import { useDispatch, useSelector } from 'src/redux/store';

const steps = [
  {
    label: 'Thông tin chung',
    description: `Bắt buộc`,
  },
  {
    label: 'Chữ ký số',
    description: 'Thời gian hiệu lực',
  },
  //   {
  //     label: 'Thông tin khác',
  //     description: `Tuỳ chọn`,
  //   },
];

function AccountStepper() {
  // const [activeStep, setActiveStep] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const formStep = useSelector((state) => state.profile.profileFormStep);

  const isUpdateSuccess = useSelector((state) => state.profile.isUpdateSuccess);

  const newUserData = useSelector((state) => state.profile.newProfileData);

  const showSnackBar = useCallback(() => {
    if (isUpdateSuccess) {
      dispatch(setFormStep(true));
      enqueueSnackbar('Cập nhật thành công!');
    } else {
      enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
    }
  }, [isUpdateSuccess]);

  const handleNext = async (index: number) => {
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (index === steps.length - 1) {
      await dispatch(updateProfileData(newUserData));
      dispatch(setFormStep(true));
    } else {
      dispatch(setFormStep(true));
    }
  };

  const handleBack = () => {
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
    dispatch(setFormStep(false));
  };

  const handleReset = () => {
    dispatch(resetFormStep());
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={formStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel optional={<Typography variant="caption">{step.description}</Typography>}>
              {step.label}
            </StepLabel>
            <StepContent>
              {/* <Typography>{step.description}</Typography> */}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => handleNext(index)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Kết thúc' : 'Tiếp tục'}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Quay lại
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {formStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Tất cả các bước đã hoàn tất</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Đặt lại
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default AccountStepper;
