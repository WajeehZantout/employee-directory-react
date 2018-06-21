// @flow

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

type Props = {
  employeesQuery: Object,
};

class EmployeesTable extends Component<Props, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTable() {
    const { employees, loading } = this.props.employeesQuery;
    return (
      <ReactTable
        data={employees}
        loading={loading}
        columns={[
          {
            Header: 'Employees Table',
            columns: [
              {
                Header: 'First Name',
                accessor: 'firstName',
              },
              {
                Header: 'Last Name',
                accessor: 'lastName',
              },
              {
                Header: 'Job Title',
                accessor: 'jobTitle',
              },
              {
                Header: 'Phone Number',
                accessor: 'phoneNumber',
              },
              {
                Header: 'Edit',
                width: 90,
                Filter: () => null,
                Cell: () => null,
              },
              {
                Header: 'Remove',
                width: 90,
                Filter: () => null,
                Cell: () => null,
              },
            ],
          },
        ]}
        filterable
        defaultFilterMethod={(filter, row) => {
          const id = filter.pivotId || filter.id;
          return row[id]
            ? String(row[id])
                .toLowerCase()
                .startsWith(filter.value.toLowerCase())
            : true;
        }}
        showPageSizeOptions={false}
        className="-striped -highlight"
      />
    );
  }

  render() {
    return <div className="container">{this.renderTable()}</div>;
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
