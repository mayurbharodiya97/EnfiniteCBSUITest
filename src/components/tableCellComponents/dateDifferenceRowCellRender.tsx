import { differenceInCalendarDays } from "date-fns";
import { CellWrapper } from "./cellWrapper";

/* eslint-disable eqeqeq */

export const DateDifferenceCalculatorRenderer = (props) => {
  const value = props?.cell?.row?.original ?? "";

  const todaysDate = new Date().getTime();
  const dueDate: any = new Date(value?.due_date).getTime();
  const completionDate: any = new Date(value?.completion_date).getTime();
  let result = "-";
  let elapseTime: any;

  if (dueDate !== "" || completionDate === "") {
    elapseTime = differenceInCalendarDays(todaysDate, dueDate);
  } else if (dueDate !== "" || completionDate !== "") {
    elapseTime = differenceInCalendarDays(dueDate, completionDate);
  }

  if (value?.status === "Completed") {
    result = "-";
  } else if (elapseTime > "0") {
    result = `${elapseTime} days over due`;
  } else if (elapseTime < "0") {
    result = `${elapseTime * -1} days left`;
  } else if (elapseTime == "0") {
    let msec: any = new Date(todaysDate - dueDate);
    var hh: any = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm: any = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    if (hh < 10) {
      hh = `0${hh}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    result = `${hh + ":" + mm} mins left`;
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
