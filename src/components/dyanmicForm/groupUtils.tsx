export const isGroupExcluded = (
  formName: string,
  currentGroupFields: string[],
  excludedFields: string[]
) => {
  const remaningFields = currentGroupFields.filter((fieldName) => {
    const fullFieldName = `${formName}/${fieldName}`;
    return excludedFields.indexOf(fullFieldName) >= 0 ? false : true;
  });
  if (remaningFields.length > 0) {
    return true;
  }
  return false;
};

export const isGroupHavingError = (
  formName: string,
  currentGroupFields: string[],
  errorFields: string[]
) => {
  const remaningFields = currentGroupFields.filter((fieldName) => {
    const fullFieldName = `${formName}/${fieldName}`;
    let result = errorFields.indexOf(fullFieldName) >= 0 ? true : false;
    if (result === false) {
      result = Boolean(
        errorFields.find((one) => one.indexOf(fullFieldName) > -1)
      )
        ? true
        : false;
    }
    return result;
  });
  if (remaningFields.length > 0) {
    return true;
  }
  return false;
};
