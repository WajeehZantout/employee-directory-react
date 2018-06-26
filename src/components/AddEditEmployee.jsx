// @flow

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';

import EmployeesQuery from '../graphql/queries/Employees';
import AddEmployeeMutation from '../graphql/mutations/AddEmployee';

const REQUIRED_FIELD = 'This field is required.';
const TEL_PATTERN = '^[0-9\\-\\+\\s\\(\\)]*$';

type Props = {
  addEmployeeMutation: Function,
  history: Object,
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

  async addEmployee(e) {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;
    e.preventDefault();

    if (!firstName || !lastName || !jobTitle || !phoneNumber) {
      return this.setState({ showValidationMessage: true });
    }

    await this.props.addEmployeeMutation({
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
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;

    return (
      <form onSubmit={e => this.addEmployee(e)}>
        {this.renderField('First Name', 'firstName', firstName, 'text')}
        {this.renderField('Last Name', 'lastName', lastName, 'text')}
        {this.renderField('Job Title', 'jobTitle', jobTitle, 'text')}
        {this.renderField('Phone Number', 'phoneNumber', phoneNumber, 'tel')}
        <input className="btn btn-primary btn-block" type="submit" value="Add" />
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

export default compose(graphql(AddEmployeeMutation, { name: 'addEmployeeMutation' }))(AddEditEmployee);
