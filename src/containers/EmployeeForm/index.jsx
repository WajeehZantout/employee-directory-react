// @flow

import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Helmet } from 'react-helmet';

import EmployeesQuery from '../../graphql/queries/Employees';
import AddEmployeeMutation from '../../graphql/mutations/AddEmployee';
import EmployeeQuery from '../../graphql/queries/Employee';
import UpdateEmployeeInfoMutation from '../../graphql/mutations/UpdateEmployeeInfo';
import { REQUIRED_FIELD, EMPLOYEE_ADD_MESSAGE, EMPLOYEE_UPDATE_MESSAGE } from '../../constants';
import FormInput from '../../components/FormInput';
import { showSuccessAlert, showErrorAlert } from '../../utils/alert';

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

  addEmployee() {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { client, history } = this.props;

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
        showSuccessAlert(EMPLOYEE_ADD_MESSAGE);
        history.replace('/');
      })
      .catch(() => {
        this.setState({ loading: false });
        showErrorAlert();
      });
  }

  updateEmployeeInfo() {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { id } = this.props.match.params;
    const { client, history } = this.props;

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
        showSuccessAlert(EMPLOYEE_UPDATE_MESSAGE);
        history.replace('/');
      })
      .catch(() => {
        this.setState({ loading: false });
        showErrorAlert();
      });
  }

  submitForm(e) {
    e.preventDefault();
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { id } = this.props.match.params;

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    return this.setState(
      { loading: true },
      () => (id ? this.updateEmployeeInfo() : this.addEmployee()),
    );
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
      <form onSubmit={e => this.submitForm(e)}>
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
    const { id } = this.props.match.params;

    return (
      <div className="container pt-3">
        <Helmet>
          <title>{id ? 'Edit | Employee Directory' : 'Add | Employee Directory'}</title>
        </Helmet>
        <h2 className="mb-3 text-white">Employees Details:</h2>
        {this.renderContent()}
      </div>
    );
  }
}

export default withApollo(EmployeeForm);
