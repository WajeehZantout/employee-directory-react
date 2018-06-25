// @flow

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Button from './Button';
import EmployeesQuery from '../graphql/queries/EmployeesQuery';
import RemoveEmployeeMutation from '../graphql/mutations/RemoveEmployeeMutation';

type Props = {
  employeesQuery: Object,
  removeEmployeeMutation: Function,
};

const EMPLOYEE_REMOVAL_CONFIRMATION = 'Are you sure you want to remove this employee ?';

class EmployeesTable extends Component<Props, {}> {
  async removeEmployee(id) {
    /* eslint no-alert: 0 */
    if (window.confirm(EMPLOYEE_REMOVAL_CONFIRMATION)) {
      await this.props.removeEmployeeMutation({
        variables: {
          id,
        },
        update: (store, { data: { removeEmployee } }) => {
          const data = store.readQuery({ query: EmployeesQuery });
          const index = data.employees.map(employee => employee.id).indexOf(removeEmployee.id);
          data.employees.splice(index, 1);
          store.writeQuery({
            query: EmployeesQuery,
            data,
          });
        },
      });
    }
  }

  static renderAddButton() {
    return (
      <Button className="btn btn-success" onClick={() => {}}>
        Add <i className="fa fa-plus-circle" />
      </Button>
    );
  }

  renderRemoveButton(employeeID) {
    return (
      <Button
        className="btn btn-danger btn-block btn-sm"
        onClick={() => this.removeEmployee(employeeID)}
      >
        <i className="fa fa-trash" />
      </Button>
    );
  }

  static renderEditButton() {
    return (
      <Button className="btn btn-primary btn-block btn-sm" onClick={() => {}}>
        <i className="fa fa-edit" />
      </Button>
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
                Cell: row => this.renderRemoveButton(row.original.id),
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

export default compose(
  graphql(EmployeesQuery, { name: 'employeesQuery' }),
  graphql(RemoveEmployeeMutation, { name: 'removeEmployeeMutation' }),
)(EmployeesTable);
