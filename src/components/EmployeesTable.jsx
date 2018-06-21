// @flow

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class EmployeesTable extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <p>Employees Table</p>
      </div>
    );
  }
}

const EMPLOYEES_QUERY = gql`
  query EmployeesQuery {
    employees {
      id
      firstName
      lastName
      jobTitle
      phoneNumber
    }
  }
`;

export default graphql(EMPLOYEES_QUERY, { name: 'employeesQuery' })(EmployeesTable);
