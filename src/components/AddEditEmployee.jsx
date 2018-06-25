import React, { Component } from 'react';

const REQUIRED_FIELD = 'This field is required.';
const TEL_PATTERN = '^[0-9\\-\\+\\s\\(\\)]*$';

export default class AddEditEmployee extends Component {
  state = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    showValidationMessage: false,
  };

  renderValidationMessage(fieldValue) {
    if (this.state.showValidationMessage && !fieldValue) {
      return <div className="text-danger">{REQUIRED_FIELD}</div>;
    }
    return null;
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

  renderContent() {
    const {
      firstName, lastName, jobTitle, phoneNumber,
    } = this.state;

    return (
      <form onSubmit={() => {}}>
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
