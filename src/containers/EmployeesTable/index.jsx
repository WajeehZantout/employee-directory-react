// @flow

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import swal from 'sweetalert';

import Table from '../../components/Table';
import Button from '../../components/Button';
import EmployeesQuery from '../../graphql/queries/Employees';
import RemoveEmployeeMutation from '../../graphql/mutations/RemoveEmployee';
import {
  EMPLOYEE_REMOVAL_CONFIRMATION,
  CONFIRMATION,
  SUCCESS,
  EMPLOYEE_REMOVE_MESSAGE,
  ERROR,
  CHECK_INTERNET_CONNECTION,
} from '../../constants';

type Props = {
  employeesQuery: Object,
  removeEmployeeMutation: Function,
  history: Object,
};

class EmployeesTable extends Component<Props, {}> {
  removeEmployee(id) {
    const { removeEmployeeMutation } = this.props;
    swal(CONFIRMATION, EMPLOYEE_REMOVAL_CONFIRMATION, {
      buttons: {
        cancel: {
          visible: true,
        },
        confirm: {
          className: 'btn-danger',
        },
      },
    }).then((value) => {
      if (value) {
        removeEmployeeMutation({
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
        })
          .then((res) => {
            if (res.data.removeEmployee) {
              swal(SUCCESS, EMPLOYEE_REMOVE_MESSAGE, 'success', {
                buttons: {
                  confirm: {
                    className: 'btn-primary',
                  },
                },
              });
            }
          })
          .catch(() =>
            swal(ERROR, CHECK_INTERNET_CONNECTION, 'error', {
              buttons: { confirm: { className: 'btn-primary' } },
            }));
      }
    });
  }

  renderAddButton() {
    return (
      <Button className="btn btn-success" onClick={() => this.props.history.push('/new')}>
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

  renderEditButton(employeeID) {
    return (
      <Button
        className="btn btn-primary btn-block btn-sm"
        onClick={() => this.props.history.push(`/${employeeID}`)}
      >
        <i className="fa fa-edit" />
      </Button>
    );
  }

  renderHeader() {
    return (
      <div className="d-flex justify-content-between mb-3 text-white">
        <h2>Employees Table</h2>
        {this.renderAddButton()}
      </div>
    );
  }

  renderTable() {
    const { employees, loading } = this.props.employeesQuery;
    return (
      <Table
        data={employees}
        loading={loading}
        renderEditButton={id => this.renderEditButton(id)}
        renderRemoveButton={id => this.renderRemoveButton(id)}
      />
    );
  }

  render() {
    return (
      <div className="container pt-3 pb-3">
        {this.renderHeader()}
        {this.renderTable()}
      </div>
    );
  }
}

export default compose(
  graphql(EmployeesQuery, { name: 'employeesQuery' }),
  graphql(RemoveEmployeeMutation, { name: 'removeEmployeeMutation' }),
)(EmployeesTable);
