// @flow

import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import swal from 'sweetalert';

import EmployeesQuery from '../../graphql/queries/Employees';
import AddEmployeeMutation from '../../graphql/mutations/AddEmployee';
import EmployeeQuery from '../../graphql/queries/Employee';
import UpdateEmployeeInfoMutation from '../../graphql/mutations/UpdateEmployeeInfo';
import {
  REQUIRED_FIELD,
  SUCCESS,
  EMPLOYEE_ADD_MESSAGE,
  EMPLOYEE_UPDATE_MESSAGE,
  ERROR,
  CHECK_INTERNET_CONNECTION,
} from '../../constants';
import FormInput from '../../components/FormInput';

type Props = {
  client: Object,
  history: Object,
  match: Object,
};

type State = {
  firstName: string,
  lastName: string,
  jobTitle: string,
  phoneNumber: string,
  showValidationMessage: boolean,
  loading: boolean,
};

/* eslint consistent-return: 0 */
class EmployeeForm extends Component<Props, State> {
  state = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    showValidationMessage: false,
    loading: false,
  };

  componentDidMount() {
    const { match, client, history } = this.props;
    const {
      params: { id },
      path,
    } = match;

    if (path !== '/new') {
      client
        .query({
          query: EmployeeQuery,
          variables: {
            id,
          },
        })
        .then((response) => {
          if (response.data.employee) {
            const {
              firstName, lastName, jobTitle, phoneNumber,
            } = response.data.employee;
            this.setState({
              firstName,
              lastName,
              jobTitle,
              phoneNumber,
            });
          } else {
            history.replace('/new');
          }
        });
    }
  }

  addEmployee(e) {
    e.preventDefault();
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { client, history } = this.props;

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    this.setState({ loading: true }, () => {
      client
        .mutate({
          mutation: AddEmployeeMutation,
          variables: {
            firstName,
            lastName,
            jobTitle,
            phoneNumber,
          },
          update: (store, { data: { addEmployee } }) => {
            const data = store.readQuery({
              query: EmployeesQuery,
            });
            data.employees.unshift(addEmployee);
            store.writeQuery({
              query: EmployeesQuery,
              data,
            });
          },
        })
        .then(() => {
          swal(SUCCESS, EMPLOYEE_ADD_MESSAGE, 'success', {
            buttons: {
              confirm: {
                className: 'btn-primary',
              },
            },
          });
          history.replace('/');
        })
        .catch(() => {
          this.setState({ loading: false });
          swal(ERROR, CHECK_INTERNET_CONNECTION, 'error', {
            buttons: { confirm: { className: 'btn-primary' } },
          });
        });
    });
  }

  updateEmployeeInfo(e) {
    e.preventDefault();
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { id } = this.props.match.params;
    const { client, history } = this.props;

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    this.setState({ loading: true }, () => {
      client
        .mutate({
          mutation: UpdateEmployeeInfoMutation,
          variables: {
            id,
            firstName,
            lastName,
            jobTitle,
            phoneNumber,
          },
        })
        .then(() => {
          swal(SUCCESS, EMPLOYEE_UPDATE_MESSAGE, 'success', {
            buttons: {
              confirm: {
                className: 'btn-primary',
              },
            },
          });
          history.replace('/');
        })
        .catch(() => {
          this.setState({ loading: false });
          swal(ERROR, CHECK_INTERNET_CONNECTION, 'error', {
            buttons: { confirm: { className: 'btn-primary' } },
          });
        });
    });
  }

  renderField(label, name, value, type) {
    return (
      <FormInput
        label={label}
        name={name}
        value={value}
        type={type}
        onChange={e => this.setState({ [name]: e.target.value })}
      >
        {this.renderValidationMessage(value)}
      </FormInput>
    );
  }

  renderValidationMessage(fieldValue) {
    if (this.state.showValidationMessage && !fieldValue) {
      return <div className="text-danger">{REQUIRED_FIELD}</div>;
    }
    return null;
  }

  renderContent() {
    const { id } = this.props.match.params;
    const {
      firstName, lastName, jobTitle, phoneNumber, loading,
    } = this.state;

    return (
      <form onSubmit={e => (id ? this.updateEmployeeInfo(e) : this.addEmployee(e))}>
        {this.renderField('First Name', 'firstName', firstName, 'text')}
        {this.renderField('Last Name', 'lastName', lastName, 'text')}
        {this.renderField('Job Title', 'jobTitle', jobTitle, 'text')}
        {this.renderField('Phone Number', 'phoneNumber', phoneNumber, 'tel')}
        <button className="btn btn-primary btn-block">
          {loading && <i className="fa fa-circle-o-notch fa-spin mr-2" />}
          {id ? 'Save' : 'Add'}
        </button>
      </form>
    );
  }

  render() {
    return (
      <div className="container pt-3">
        <h2 className="mb-3 text-white">Employees Details:</h2>
        {this.renderContent()}
      </div>
    );
  }
}

export default withApollo(EmployeeForm);
