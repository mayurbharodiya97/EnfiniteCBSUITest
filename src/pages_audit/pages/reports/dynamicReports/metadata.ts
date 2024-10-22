import { filters } from "@acuteinfo/common-base";

export const metaData = {
  title: "Customer Registration Report",
  disableGroupBy: "",
  hideFooter: "",
  hideAmountIn: "",
  filters: [
    {
      accessor: "FROM_DT",
      columnName: "From Date",
      filterComponentType: "valueDateFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "TO_DT",
      columnName: "To Date",
      filterComponentType: "valueDateFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
  ],
  columns: [
    {
      columnName: "User Name",
      accessor: "CUST_NAME",
      width: 180,
      type: "default",
    },
    {
      columnName: "Role Name",
      accessor: "userRoleName",
      Filter: filters.SelectColumnFilter,
      width: 180,
    },
    {
      columnName: "Products",
      accessor: "productCode",
      width: 250,
    },
    {
      columnName: "Branch Name",
      accessor: "branchName",
      Filter: filters.SelectColumnFilter,
      width: 180,
    },
    {
      columnName: "Team Role Name",
      accessor: "teamRoleName",
      Filter: filters.SelectColumnFilter,
      width: 180,
    },
    {
      columnName: "Team User Name",
      accessor: "teamUserFullName",
      width: 180,
    },
  ],
};
