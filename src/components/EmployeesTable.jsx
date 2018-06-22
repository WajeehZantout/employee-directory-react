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

  static renderAddButton() {
    return (
      <button className="btn btn-success">
        Add <i className="fa fa-plus-circle" />
      </button>
    );
  }

  static renderRemoveButton() {
    return (
      <button className="btn btn-danger btn-block btn-sm" onClick={() => {}}>
        <i className="fa fa-trash" />
      </button>
    );
  }

  static renderEditButton() {
    return (
      <button className="btn btn-primary btn-block btn-sm" onClick={() => {}}>
        <i className="fa fa-edit" />
      </button>
    );
  }

  static renderHeader() {
    return (
      <div className="d-flex justify-content-between">
        <h2>Employees Table</h2>
        {EmployeesTable.renderAddButton()}
      </div>
    );
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
                sortable: false,
                filterable: false,
                Cell: () => EmployeesTable.renderEditButton(),
              },
              {
                Header: 'Remove',
                width: 90,
                sortable: false,
                filterable: false,
                Cell: () => EmployeesTable.renderRemoveButton(),
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
    return (
      <div className="container">
        {EmployeesTable.renderHeader()}
        {this.renderTable()}
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
