import {
  FC,
  cloneElement,
  Fragment,
  useRef,
  useState,
  useCallback,
} from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { renderField } from "components/dyanmicForm/utils/fieldRenderer";
import { FieldMetaDataType } from "components/dyanmicForm/";
import { useFieldArray, formFieldAtom } from "packages/form";
import { extendFieldTypes } from "components/dyanmicForm/utils/extendedFieldTypes";
import { extendedMetaData } from "components/dyanmicForm/extendedTypes";
import { attachMethodsToMetaData } from "components/dyanmicForm/utils/attachMethodsToMetaData";
import { MoveSequenceToRender } from "components/dyanmicForm/utils/fixSequenceInMetaData";
import { MetaDataType } from "components/dyanmicForm";
import { useStyles } from "./style";
import { useRecoilCallback } from "recoil";
import { cloneDeep } from "lodash-es";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  GridProps,
  IconButton,
  Typography,
} from "@mui/material";
export interface ArrayField2Props {
  fieldKey: string;
  name: string;
  label: string;
  //just to satisfy typescript no use
  enableGrid: boolean;
  GridProps?: GridProps;
  _fields: FieldMetaDataType[];
  componentProps?: any;
  removeRowFn?: any;
  addRowFn?: any;
  arrayFieldIDName?: string;
  dependentFields?: string | string[];
  shouldExclude?: any;
  fixedRows?: boolean;
  isDisplayCount?: boolean;
  isCustomStyle?: any;
  getFixedRowsCount?: any;
}

const metaDataTransform = (metaData: MetaDataType): MetaDataType => {
  metaData = extendFieldTypes(metaData, extendedMetaData);
  metaData = attachMethodsToMetaData(metaData);
  metaData = MoveSequenceToRender(metaData);
  return metaData;
};

export const ArrayField2: FC<ArrayField2Props> = ({
  name,
  label,
  _fields,
  GridProps,
  enableGrid,
  componentProps = {},
  removeRowFn,
  addRowFn,
  arrayFieldIDName,
  dependentFields,
  shouldExclude,
  fixedRows,
  isDisplayCount,
  isCustomStyle,
  getFixedRowsCount,
}) => {
  // let currentFieldsMeta = JSON.parse(
  //   JSON.stringify(_fields)
  // ) as FieldMetaDataType[];
  let currentFieldsMeta = cloneDeep(_fields) as FieldMetaDataType[];
  const classes = useStyles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  let metaData = { form: {}, fields: currentFieldsMeta } as MetaDataType;
  const transformedMetaData = useRef<MetaDataType | null>(null);
  if (transformedMetaData.current === null) {
    transformedMetaData.current = metaDataTransform(metaData);
  }
  const template = useRef(
    transformedMetaData?.current?.fields?.reduce((accum, one) => {
      accum[one.name] = "";
      return accum;
    }, {})
  );

  const currentMetaToObj = useRef(
    transformedMetaData?.current?.fields?.reduce((accum, one) => {
      accum[one.name] = one;
      return accum;
    }, {})
  );

  const {
    renderRows,
    getAllRowsValues,
    unshift,
    isSubmitting,
    formState,
    formName,
    excluded,
  } = useFieldArray({
    arrayFieldName: name,
    template: template.current,
    dependentFields: dependentFields,
    shouldExclude: shouldExclude,
    getFixedRowsCount: getFixedRowsCount,
  });

  /*eslint-disable react-hooks/exhaustive-deps*/
  const addNewRow = useCallback(() => {
    if (typeof addRowFn === "function") {
      let result = addRowFn(getAllRowsValues());
      let allow = false;
      let reason = "Cannot add a new Row";
      if (typeof result === "boolean") {
        allow = result;
      }
      if (typeof result === "object") {
        allow = result?.allow ?? false;
        reason = result?.reason ?? "Cannot add a new Row";
      }
      if (allow) {
        unshift();
      } else {
        setShowAddDialog(true);
        setDialogMsg(reason);
      }
    } else {
      unshift();
    }
  }, [unshift, getAllRowsValues]);

  if (excluded) {
    return null;
  }

  let rows = renderRows(({ row, removeFn, rowIndex, fields, totalRows }) => {
    const oneRow = fields.map((field) => {
      const currentFieldMetaData = currentMetaToObj.current[field];
      if (!Boolean(currentFieldMetaData)) {
        return null;
      }

      let newMTdata;
      if (rowIndex === 0) {
        newMTdata = { ...currentFieldMetaData };
      } else {
        newMTdata = { ...currentFieldMetaData, label: null };
      }

      const component = renderField(
        isCustomStyle ? newMTdata : currentFieldMetaData,
        //@ts-ignore
        {},
        name,
        componentProps
      );

      const clonedComponent = cloneElement(component, {
        fieldKey: row.cells[field].key,
        name: row.cells[field].name,
      });
      return <Fragment key={row.cells[field].key}>{clonedComponent}</Fragment>;
    });
    return (
      <ArrayFieldRow
        key={row.fieldIndexKey}
        fieldKey={row.cells[arrayFieldIDName ?? ""]?.key ?? ""}
        oneRow={oneRow}
        classes={classes}
        removeFn={removeFn}
        rowIndex={rowIndex}
        removeRowFn={removeRowFn}
        row={row}
        totalRows={totalRows}
        isSubmitting={isSubmitting}
        formState={formState}
        formName={formName}
        arrayFieldIDName={arrayFieldIDName}
        arrayFieldName={name}
        fixedRows={fixedRows}
        isDisplayCount={isDisplayCount}
        isCustomStyle={isCustomStyle}
      />
    );
  });
  let result = (
    <Fragment>
      <Card className={classes.arrayRowCard}>
        <CardHeader
          style={{ padding: "0px" }}
          title={label}
          action={
            !Boolean(fixedRows) ? (
              <IconButton onClick={addNewRow} disabled={isSubmitting}>
                <AddCircleOutlineIcon />
              </IconButton>
            ) : null
          }
        />
        <CardContent
          style={{ paddingBottom: "0px" }}
          className={classes.arrayRowCardContent}
        >
          <Grid
            container
            item
            spacing={1}
            xs={12}
            md={12}
            sm={12}
            style={{ padding: "05px" }}
          >
            {rows}
            {rows.length <= 0 ? (
              <Typography>
                No Records Found, click the add button to add one
              </Typography>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={showAddDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddDialog(false);
              setDialogMsg("");
            }}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
  if (Boolean(enableGrid)) {
    return (
      <Grid container {...GridProps} key={name}>
        {result}
      </Grid>
    );
  } else {
    return <Fragment key={name}>{result}</Fragment>;
  }
};

export const ArrayFieldRow = ({
  row,
  fieldKey,
  oneRow,
  classes,
  removeFn,
  rowIndex,
  removeRowFn,
  totalRows,
  isSubmitting,
  formState,
  formName,
  arrayFieldIDName,
  arrayFieldName,
  fixedRows,
  isDisplayCount = true,
  isCustomStyle = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dialogAccept = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const loader = snapshot.getLoadable(
          formFieldAtom(`${formName}/${fieldKey}`)
        );
        if (loader.state === "hasValue") {
          const field = loader.contents;
          if (Boolean(field.value)) {
            try {
              setLoading(true);
              await Promise.resolve(
                removeRowFn(
                  { ...formState, [arrayFieldIDName]: field.value },
                  arrayFieldName
                )
              );
              setLoading(false);
              setError("");
              setSuccess(true);
            } catch (e) {
              console.log(e);
              setLoading(false);
              //@ts-ignore
              setError(e?.error_msg ?? "Unkown error occured");
            }
          } else {
            setSuccess(true);
          }
        }
      },
    [setError, setSuccess, setLoading]
  );
  const dialogReject = useCallback(() => {
    if (success) {
      removeFn(rowIndex);
    } else {
      setIsDialogOpen(false);
      setTimeout(() => {
        setLoading(false);
        setError("");
        setSuccess(false);
      }, 1);
    }
  }, [
    setIsDialogOpen,
    setLoading,
    setError,
    setSuccess,
    success,
    removeFn,
    rowIndex,
  ]);
  const dialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, [setIsDialogOpen]);

  let finalClass;
  if (Boolean(isCustomStyle)) {
    if (rowIndex != 0) {
      finalClass = classes.newArrayRowContainer;
    } else {
      finalClass = classes.newSecondArrayRowContainer;
    }
  } else {
    finalClass = classes.arrayRowContainer;
  }

  return (
    <Fragment key={row.fieldIndexKey}>
      {Boolean(isDisplayCount) ? (
        <Typography gutterBottom className={classes.arrayRowCount}>
          {rowIndex + 1} of {totalRows}
        </Typography>
      ) : null}
      <Grid
        container
        item
        xs={12}
        md={12}
        sm={12}
        spacing={2}
        className={finalClass}
      >
        {oneRow}
        {typeof removeFn === "function" && !Boolean(fixedRows) ? (
          <IconButton
            onClick={dialogOpen}
            className={classes.arrayRowRemoveBtn}
            disabled={isSubmitting}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        ) : null}
      </Grid>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {success
            ? "Record successfully deleted"
            : loading
            ? "Please wait deleting record"
            : Boolean(error)
            ? error
            : "Are you Sure you want to delete this record?"}
        </DialogTitle>
        {success || error ? (
          <DialogActions>
            <Button onClick={dialogReject} color="primary">
              Ok
            </Button>
          </DialogActions>
        ) : loading ? null : (
          <DialogActions>
            <Button onClick={dialogReject} color="primary">
              Disagree
            </Button>
            <Button onClick={dialogAccept} color="primary">
              Agree
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  );
};
