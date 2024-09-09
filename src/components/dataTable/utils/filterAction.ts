export const filterAction = (
  actions: any,
  selectedFlatRows: any,
  authDetails?: any,
  singleAction?: boolean
) => {
  if (!Array.isArray(actions) && Boolean(actions)) {
    actions = [actions];
  }

  if (actions.length <= 0 || selectedFlatRows.length <= 0) {
    if (singleAction === true) {
      return actions[0];
    }
    //console.log("selectedFlatRows.length", selectedFlatRows.length);
    return actions;
  }
  let result = actions.filter((one) => {
    if (typeof one?.shouldExclude === "function") {
      if (
        one.shouldExclude(
          selectedFlatRows.map((one) => ({ id: one.id, data: one.original })),
          authDetails
        ) === true
      ) {
        return false;
      }
      //return true;
    }

    return true;
  });
  if (singleAction === true) {
    return result[0];
  }
  return result;
};

export const filterActionWhenNoDataFound = (actions: any, count: any) => {
  let result = actions.filter((one) => {
    if ((one?.isNodataThenShow ?? false) && count === 0) {
      return true;
    } else if (!(one?.isNodataThenShow ?? false) && count > 0) {
      return true;
    }
    return false;
  });

  return result;
};
