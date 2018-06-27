// @flow

import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

import EmployeesQuery from '../graphql/queries/Employees';
import AddEmployeeMutation from '../graphql/mutations/AddEmployee';
import EmployeeQuery from '../graphql/queries/Employee';
import UpdateEmployeeInfoMutation from '../graphql/mutations/UpdateEmployeeInfo';

const REQUIRED_FIELD = 'This field is required.';
const TEL_PATTERN = '^[0-9\\-\\+\\s\\(\\)]*$';

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
};

class AddEditEmployee extends Component<Props, State> {
  state = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    showValidationMessage: false,
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

  async addEmployee(e) {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    e.preventDefault();

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    await this.props.client.mutate({
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
        data.employees.push(addEmployee);
        store.writeQuery({
          query: EmployeesQuery,
          data,
        });
      },
    });

    return this.props.history.replace('/');
  }

  async updateEmployeeInfo(e) {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    const { id } = this.props.match.params;
    e.preventDefault();

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    await this.props.client.mutate({
      mutation: UpdateEmployeeInfoMutation,
      variables: {
        id,
        firstName,
        lastName,
        jobTitle,
        phoneNumber,
      },
    });

    return this.props.history.replace('/');
  }

  renderField(label, key, value, type) {
    return (
      <div className="form-group">
        <label htmlFor={key}>{label}</label>
        <input
          id={key}
          type={type}
          pattern={type === 'tel' ? TEL_PATTERN : null}
          className="form-control"
          value={value}
          onChange={e => this.setState({ [key]: e.target.value })}
        />
        {this.renderValidationMessage(value)}
      </div>
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
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;

    return (
      <form onSubmit={e => (id ? this.updateEmployeeInfo(e) : this.addEmployee(e))}>
        {this.renderField('First Name', 'firstName', firstName, 'text')}
        {this.renderField('Last Name', 'lastName', lastName, 'text')}
        {this.renderField('Job Title', 'jobTitle', jobTitle, 'text')}
        {this.renderField('Phone Number', 'phoneNumber', phoneNumber, 'tel')}
        <input className="btn btn-primary btn-block" type="submit" value={id ? 'Save' : 'Add'} />
      </form>
    );
  }

  render() {
    return (
      <div className="container">
        <h2>Employees Details:</h2>
        {this.renderContent()}
      </div>
    );
  }
}

export default withApollo(AddEditEmployee);
