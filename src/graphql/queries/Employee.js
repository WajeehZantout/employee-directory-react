import gql from 'graphql-tag';

export default gql`
  query EmployeeQuery($id: String!) {
    employee(id: $id) {
      id
      firstName
      lastName
      jobTitle
      phoneNumber
    }
  }
`;
