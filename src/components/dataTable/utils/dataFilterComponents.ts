export const DataFilterComponents = (filter: any[], data: any[]) => {
  let retData: any[];
  //console.log(filter, data);
  //return data;

  if (filter.length > 0)
    retData = data.filter((item) => CheckDataWithFilter(item, filter));
  else retData = data;
  //console.log(retData);
  return retData;
};
const CheckFilterValue = (value, filter) => {
  let retvalue: boolean = true;
  if (value !== undefined) {
    switch (filter.condition) {
      case "equal":
        retvalue =
          (value ?? "").toLowerCase() === (filter.value ?? "").toLowerCase();
        break;
      case "startsWith":
        retvalue = (value ?? "")
          .toLowerCase()
          .startsWith((filter.value ?? "").toLowerCase());
        break;
      case "endsWith":
        retvalue = (value ?? "")
          .toLowerCase()
          .endsWith((filter.value ?? "").toLowerCase());
        break;
      case "contains":
        retvalue =
          (value ?? "")
            .toLowerCase()
            .indexOf((filter.value ?? "").toLowerCase()) >= 0;
        break;
      default:
        retvalue = true;
    }
  }
  return retvalue;
};
const CheckDataWithFilter = (itemdata, filter) => {
  let retvalue: boolean = true;
  filter.forEach((item) => {
    if (itemdata[item.id] !== undefined) {
      if (!CheckFilterValue(itemdata[item.id], item.value)) {
        retvalue = false;
        return;
      }
    }
  });
  //console.log(filter, itemdata, retvalue);
  return retvalue;
};
