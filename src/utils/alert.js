import swal from 'sweetalert';

import {
  SUCCESS,
  ERROR,
  CHECK_INTERNET_CONNECTION,
  CONFIRMATION,
  EMPLOYEE_REMOVAL_CONFIRMATION,
} from '../constants';

const showSuccessAlert = (message) => {
  swal(SUCCESS, message, 'success', {
    buttons: {
      confirm: {
        className: 'btn-primary',
      },
    },
  });
};

const showErrorAlert = () => {
  swal(ERROR, CHECK_INTERNET_CONNECTION, 'error', {
    buttons: { confirm: { className: 'btn-primary' } },
  });
};

const showConfirmationAlert = () =>
  swal(CONFIRMATION, EMPLOYEE_REMOVAL_CONFIRMATION, {
    buttons: {
      cancel: {
        visible: true,
      },
      confirm: {
        className: 'btn-danger',
      },
    },
  });

module.exports = {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
};
