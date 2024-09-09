import { matchSorter } from "match-sorter";

export const fuzzyTextFilterFn = (rows, id, filterValue) =>
  matchSorter(rows, filterValue, { keys: [(row: any) => row.values[id]] });

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

export const customText = (rows, id, filterValue) => {
  console.log(rows, id, filterValue);
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      : true;
  });
};

export const filterGreaterThan = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export const customInclude = (rows, ids, filterValue) => {
  let result = rows.filter((row) => {
    return ids.some((id) => {
      const rowValue = row.values[id];
      console.log(rowValue, rowValue.length);
      return (
        rowValue &&
        rowValue.length &&
        filterValue.some((val) => rowValue.includes(val))
      );
    });
  });
  return result;
};

customInclude.autoRemove = (val) => !val || !val.length;
