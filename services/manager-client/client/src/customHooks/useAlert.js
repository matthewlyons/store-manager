import { useSnackbar } from 'notistack';

export default function useAlert() {
  const { enqueueSnackbar } = useSnackbar();

  const createAlert = (message, error = true) => {
    let variant = error ? 'error' : 'success';
    if (typeof message === 'string') {
      enqueueSnackbar(message, { variant });
    } else {
      message.errors.forEach((error) => {
        enqueueSnackbar(error.message, { variant });
      });
    }
  };

  return { createAlert };
}
