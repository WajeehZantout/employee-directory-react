// @flow

import * as React from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

type Props = {
  data: Array<Object>,
  loading: Boolean,
  renderEditButton: Function,
  renderRemoveButton: Function,
};

const Table = ({
  data, loading, renderEditButton, renderRemoveButton,
}: Props) => (
  <ReactTable
    data={data}
    loading={loading}
    columns={[
      {
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
            Cell: row => renderEditButton(row.original.id),
          },
          {
            Header: 'Remove',
            width: 90,
            sortable: false,
            filterable: false,
            Cell: row => renderRemoveButton(row.original.id),
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
    className="-striped -highlight bg-light rounded p-1"
  />
);

export default Table;
