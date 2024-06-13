// check valid date
const isValidDate = (dat) => {
  try {
    if (!dat) {
      return false;
    } else {
      let dt = new Date(dat);

      if (!isNaN(dt) && dt < new Date("1900/01/01")) {
        return false;
      } else if (!isNaN(dt)) {
        return true;
      }
      return false;
    }
  } catch (error) {
    return false;
  }
};

// get retrieval param dates
const getRetrievalPara = (retrievalParams) => {
  const from_to_date = retrievalParams.filter(
    (item) => item.id === "A_FROM_DT" || item.id === "A_TO_DT"
  );
  const fromDt =
    from_to_date[0]?.value?.value ?? dateFns.format(new Date(), "DD/MM/YYYY");
  const toDt =
    from_to_date[1]?.value?.value ?? dateFns.format(new Date(), "DD/MM/YYYY");

  return { fromDt, toDt };
};

// get title for report file
const getTitleFilters = (
  retrievalParams,
  filters,
  globalFilter,
  columnLabel
) => {
  let fileTitle = "";
  if (retrievalParams.length !== 0) {
    retrievalParams.forEach((param) => {
      if (
        typeof param.value.value !== "undefined" &&
        param.value.value.toString().trim() !== ""
      ) {
        const label =
          typeof param.value?.label !== "undefined"
            ? param.value.label
            : param.value.columnName;
        const value =
          typeof param.value?.displayValue !== "undefined"
            ? param.value.displayValue
            : param.value.value;
        fileTitle += label + ": " + value + " | ";
      }
    });
  }

  if (filters.length !== 0) {
    filters.forEach((filter) => {
      if (filter.value.trim() !== "")
        fileTitle += columnLabel[filter.id] + ": " + filter.value + "* | ";
    });
  }

  if (globalFilter) fileTitle += `{${globalFilter}} | `;

  fileTitle = `[${fileTitle.substring(0, fileTitle.length - 2).trim()}]`;

  return fileTitle === "[]" ? "" : fileTitle;
};

// get dynmaic row mapping columns and rows
const getDynamicRow = (rows, columns) => {
  const filteredRows = rows.map((row) => {
    const filteredRow = {};

    columns.forEach((column) => {
      const columnKeys = Object.keys(column);

      columnKeys.forEach((key) => {
        if (key in row) {
          if (column["cellType"] === "DateTimeCell" && isValidDate(row[key])) {
            filteredRow[key] = dateFns.format(
              new Date(row[key]),
              column.format !== ""
                ? getUcaseDateFormats(column.format)
                : "DD/MM/YYYY HH:mm:ss"
            );
          } else if (
            column["cellType"] === "DateCell" &&
            isValidDate(row[key])
          ) {
            filteredRow[key] = dateFns.format(
              new Date(row[key]),
              column.format !== ""
                ? getUcaseDateFormats(column.format)
                : "DD/MM/YYYY"
            );
          } else if (
            column["cellType"] === "TimeCell" &&
            isValidDate(row[key])
          ) {
            filteredRow[key] = dateFns.format(new Date(row[key]), "HH:mm:ss");
          } else
            filteredRow[key] = typeof row[key] === "undefined" ? "" : row[key];
        } else {
          if (!["id", "cname", "cellType", "format"].includes(key))
            filteredRow[key] = "";
        }
      });
    });
    return filteredRow;
  });
  return filteredRows;
};

const getUcaseDateFormats = (format) => {
  const pattern = /.*[dDMyY].*/;

  if (!pattern.test(format)) return format;

  const formatArr = format.split(" ");
  formatArr[0] = formatArr[0].toUpperCase();

  return formatArr.join(" ");
};
