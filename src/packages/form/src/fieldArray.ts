import { useContext, useRef, useCallback, useEffect } from "react";
import {
  UseFieldArrayHookProps,
  TemplateFieldRowType,
  RenderFn,
  InitialValuesType,
} from "./types";
import {
  formArrayFieldRowsAtom,
  formArrayFieldRegisterSelector,
  formArrayFieldUnregisterSelector,
  formFieldUnregisterSelector,
  formArrayFieldRegistryAtom,
  formFieldsErrorWatcherRemoveSelector,
  formAtom,
  formFieldAtom,
  subscribeToFormFieldsSelector,
  formFieldRegistryAtom,
} from "./atoms";
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilCallback,
  useRecoilValue,
} from "recoil";
import { getIn, setIn } from "./util";
import { FormContext } from "./context";

export const useFieldArray = ({
  arrayFieldName,
  template,
  shouldExclude,
  dependentFields,
  getFixedRowsCount,
}: UseFieldArrayHookProps) => {
  //fromContext provides formName for scoping
  const formContext = useContext(FormContext);
  //caching template keys passed as object which are fields per row in the fieldArray
  let templateFieldNamesRef = useRef<string[]>(Object.keys(template));
  const formState = useRecoilValue(formAtom(formContext.formName));
  //fieldRows keeps track of fields in the field array,
  //also will keep track of last inserted field index which forms the
  //basis of fieldKey to uniquely identify field in the formFieldAtom
  //eg - arrayFieldName[index].templateFieldName
  const [fieldRows, setFieldRows] = useRecoilState(
    formArrayFieldRowsAtom(`${formContext.formName}/${arrayFieldName}`)
  );
  //fieldRowsRef for memoization purpose
  const fieldRowsRef = useRef(fieldRows);
  fieldRowsRef.current = fieldRows;

  //registerField function registers the currentField to the fields registry if not registered,
  //and keeping track of all the active array fields in the form
  const registerArrayField = useSetRecoilState(
    formArrayFieldRegisterSelector(formContext.formName)
  );
  //unregisterField function unregistered the current arrayField from the fields registry
  const unregisterArrayField = useSetRecoilState(
    formArrayFieldUnregisterSelector(formContext.formName)
  );

  const unregisterField = useSetRecoilState(
    formFieldUnregisterSelector(formContext.formName)
  );

  const RemoveFieldsFromErrorWatcher = useRecoilCallback(
    ({ set }) =>
      ({ fieldName }) => {
        set(
          formFieldsErrorWatcherRemoveSelector(formContext.formName),
          fieldName
        );
      },
    []
  );

  const isFieldRegistered = useRecoilCallback(
    ({ snapshot }) =>
      (fieldName: string) => {
        const loader = snapshot.getLoadable(
          formArrayFieldRegistryAtom(formContext.formName)
        );
        if (loader.state === "hasValue") {
          const fields = loader.contents;
          if (fields.indexOf(fieldName) > -1) {
            return true;
          } else {
            return false;
          }
        }
      },
    [formContext.formName, formArrayFieldRegisterSelector]
  );

  //New logic for should exclude and fixed Row Count set
  const dependentFieldsState = useRecoilValue(
    subscribeToFormFieldsSelector({
      formName:
        typeof shouldExclude === "function"
          ? formContext.formName
          : typeof getFixedRowsCount === "function"
          ? formContext.formName
          : `${formContext.formName}-NOTEXIST`,
      fields: dependentFields,
    })
  );

  const clearArrayFieldRows = useRecoilCallback(
    ({ reset, snapshot, set }) =>
      (templateFieldRows: TemplateFieldRowType[]) => {
        const allKeysToRemove: string[] = [];
        for (let i = 0; i < templateFieldRows.length; i++) {
          let keys = Object.keys(templateFieldRows[i]?.cells);
          for (let j = 0; j < keys.length; j++) {
            const currentFieldKey = templateFieldRows[i].cells[keys[j]].key;
            reset(formFieldAtom(`${formContext.formName}/${currentFieldKey}`));
            allKeysToRemove.push(`${formContext.formName}/${currentFieldKey}`);
          }
        }
        const fields = snapshot.getLoadable(
          formFieldRegistryAtom(formContext.formName)
        );
        if (fields.state === "hasValue") {
          let allFields = fields.getValue();
          let newAllFields = allFields.filter((one) =>
            allKeysToRemove.indexOf(one) >= 0 ? false : true
          );
          set(formFieldRegistryAtom(formContext.formName), newAllFields);
        }
      },
    []
  );

  const lastShouldExcludePromise = useRef<Promise<any> | null>(null);
  useEffect(() => {
    if (typeof shouldExclude === "function") {
      const currentShouldExcludePromise = Promise.resolve(
        shouldExclude({} as any, dependentFieldsState, formContext.formState)
      );
      lastShouldExcludePromise.current = currentShouldExcludePromise;
      currentShouldExcludePromise.then((result) => {
        if (currentShouldExcludePromise === lastShouldExcludePromise.current) {
          if (result === true && fieldRows.excluded === false) {
            setFieldRows((old) => ({ ...old, excluded: true }));
            clearArrayFieldRows(fieldRows.templateFieldRows);
            clearFieldArray();
          } else if (result === false && fieldRows.excluded === true) {
            setFieldRows((old) => ({ ...old, excluded: false }));
          }
        }
      });
    }
  });
  useEffect(() => {
    if (
      typeof getFixedRowsCount === "function" &&
      fieldRows.excluded === false
    ) {
      let currentRowCount = getFixedRowsCount(
        fieldRows,
        dependentFieldsState,
        formContext.formState
      );
      if (currentRowCount < 0) {
        currentRowCount = 0;
      }
      if (fieldRows.templateFieldRows.length !== currentRowCount) {
        let diff = currentRowCount - fieldRows.templateFieldRows.length;
        if (diff > 0) {
          //add new rows
          let index: number = fieldRows.templateFieldRows.length;
          let rowBuf: any = fieldRows.templateFieldRows;
          let lastInsertIndex = fieldRows.lastInsertIndex;
          while (diff > 0) {
            let result = _insert(
              index,
              rowBuf,
              lastInsertIndex,
              templateFieldNamesRef.current
            );
            rowBuf = result?.newRows;
            lastInsertIndex = result?.lastIndex ?? -1;
            index++;
            diff--;
          }
          if (Array.isArray(rowBuf)) {
            setFieldRows((old) => ({
              ...old,
              lastInsertIndex: lastInsertIndex,
              templateFieldRows: rowBuf,
            }));
          }
        } else {
          let indexToRemoveFrom = fieldRows.templateFieldRows.length + diff;
          let currentTemplateRows = fieldRows.templateFieldRows.slice(
            0,
            indexToRemoveFrom
          );
          let removeRows = fieldRows.templateFieldRows.slice(indexToRemoveFrom);
          clearArrayFieldRows(removeRows);
          setFieldRows((oldValues) => ({
            ...oldValues,
            templateFieldRows: currentTemplateRows,
            lastInsertIndex: oldValues.lastInsertIndex,
          }));
        }
      }
    }
  });

  //end of new should exclude logic

  const getAllRowsValues = useRecoilCallback(
    ({ snapshot }) =>
      (templateFieldRows: TemplateFieldRowType[]) => {
        const allKeysToGetValuesFrom: string[] = [];
        for (let i = 0; i < templateFieldRows.length; i++) {
          let keys = Object.keys(templateFieldRows[i]?.cells);
          for (let j = 0; j < keys.length; j++) {
            const currentFieldKey = templateFieldRows[i].cells[keys[j]].key;
            allKeysToGetValuesFrom.push(
              `${formContext.formName}/${currentFieldKey}`
            );
          }
        }
        let resultValues: any = {};
        for (let itr = 0; itr < allKeysToGetValuesFrom.length; itr++) {
          const fieldLoadable = snapshot.getLoadable(
            formFieldAtom(allKeysToGetValuesFrom[itr])
          );
          if (fieldLoadable.state === "hasValue") {
            const readOnlyFieldState = fieldLoadable.contents;
            if (readOnlyFieldState.excluded === true) {
              continue;
            } else {
              resultValues = setIn(
                resultValues,
                readOnlyFieldState.name.replace(`${formContext.formName}/`, ""),
                readOnlyFieldState.value
              );
            }
          }
        }
        return resultValues;
      },
    [formContext.formName]
  );

  //_insert adds a new field to the fieldArray with a new key
  const _insert = useCallback(
    (
      index: number,
      rowBuffer: TemplateFieldRowType[],
      lastInsertId: number,
      template: string[]
    ) => {
      if (index >= 0 && index <= rowBuffer.length) {
        const insertIndex = ++lastInsertId;
        let newRow: TemplateFieldRowType = {
          cells: {},
          fieldIndexKey: `${formContext.formName}/${arrayFieldName}/${insertIndex}`,
        };
        for (const fieldName of template) {
          const key = `${arrayFieldName}[${insertIndex}].${fieldName}`;
          const name = `${arrayFieldName}[${index}].${fieldName}`;
          newRow.cells[fieldName] = { key, name };
        }
        const beginningRows = rowBuffer.slice(0, index);
        const endingRows = rowBuffer.slice(index);
        let currentIndex = index + 1;
        for (let oneRow of endingRows) {
          for (const fieldName of template) {
            oneRow.cells[
              fieldName
            ].name = `${arrayFieldName}[${currentIndex}].${fieldName}`;
          }
          currentIndex++;
        }
        return {
          newRows: [...beginningRows, newRow, ...endingRows],
          lastIndex: insertIndex,
        };
      }
      return;
    },
    [arrayFieldName, formContext.formName]
  );
  //remove field from the fieldArray
  const remove = useCallback(
    (index: number) => {
      if (index >= 0 && index < fieldRowsRef.current.templateFieldRows.length) {
        let currentIndex = index;
        const deleteRow = fieldRowsRef.current.templateFieldRows[index];
        const beginningRows = fieldRowsRef.current.templateFieldRows.slice(
          0,
          currentIndex
        );
        const endingRows = fieldRowsRef.current.templateFieldRows.slice(
          currentIndex + 1
        );
        for (let oneRow of endingRows) {
          for (const fieldName of templateFieldNamesRef.current ?? []) {
            oneRow.cells[
              fieldName
            ].name = `${arrayFieldName}[${currentIndex}].${fieldName}`;
          }
          currentIndex++;
        }
        setFieldRows((oldValues) => ({
          ...oldValues,
          templateFieldRows: [...beginningRows, ...endingRows],
          lastInsertIndex: oldValues.lastInsertIndex,
        }));
        for (const oneField of Object.values(deleteRow.cells)) {
          if (oneField.key.indexOf(`${formContext.formName}/`) > -1) {
            unregisterField(oneField.key);
            RemoveFieldsFromErrorWatcher({ fieldName: oneField.key });
          } else {
            unregisterField(`${formContext.formName}/${oneField.key}`);
            RemoveFieldsFromErrorWatcher({
              fieldName: `${formContext.formName}/${oneField.key}`,
            });
          }
        }
      }
    },
    [
      setFieldRows,
      unregisterField,
      arrayFieldName,
      formContext.formName,
      RemoveFieldsFromErrorWatcher,
    ]
  );
  //Initialize the form array with default rows
  const setDefaultValue = useCallback(
    (initValues: InitialValuesType) => {
      const defaultArrayValue: string | undefined = getIn(
        initValues,
        arrayFieldName
      );
      if (defaultArrayValue !== undefined && Array.isArray(defaultArrayValue)) {
        let insertIndex = -1;
        let buffer: TemplateFieldRowType[] = [];
        for (let i = 0; i < defaultArrayValue.length; i++) {
          const result = _insert(
            buffer.length,
            buffer,
            insertIndex,
            templateFieldNamesRef.current
          );
          if (result !== undefined) {
            insertIndex = result.lastIndex;
            if (Array.isArray(result.newRows)) {
              buffer = result.newRows;
            }
          }
        }
        setFieldRows((old) => ({
          ...old,
          resetFlag: false,
          templateFieldRows: buffer,
          lastInsertIndex: insertIndex,
        }));
      } else {
        setFieldRows((old) => ({
          ...old,
          resetFlag: false,
          templateFieldRows: [],
          lastInsertIndex: -1,
        }));
      }
    },
    [arrayFieldName, setFieldRows, _insert]
  );
  //This effect will register and unregister fields when they mount and unmount
  //If an option is set not resetField on unmount unregister will not be called.

  useEffect(() => {
    if (!isFieldRegistered(`${formContext.formName}/${arrayFieldName}`)) {
      registerArrayField(`${formContext.formName}/${arrayFieldName}`);
      if (typeof formContext.initialValues === "object") {
        setDefaultValue(formContext.initialValues);
      }
    }
    if (Boolean(formContext.resetFieldOnUnmount) === true) {
      return () => {
        unregisterArrayField(`${formContext.formName}/${arrayFieldName}`);
      };
    }
  }, [
    registerArrayField,
    unregisterArrayField,
    formContext.formName,
    arrayFieldName,
    formContext.resetFieldOnUnmount,
    formContext.initialValues,
    setDefaultValue,
    isFieldRegistered,
  ]);
  //triggers fieldArray reset
  useEffect(() => {
    if (
      fieldRows.resetFlag === true &&
      typeof formContext.initialValues === "object" &&
      Object.keys(formContext.initialValues).length > 0
    ) {
      setDefaultValue(formContext.initialValues);
    }
  }, [fieldRows.resetFlag, setDefaultValue, formContext.initialValues]);

  //utility function to renderRows
  const renderRows = useCallback(
    (renderFn: RenderFn) => {
      return fieldRowsRef.current.templateFieldRows.map((row, idx) => {
        return renderFn({
          row,
          fields: templateFieldNamesRef.current?.slice?.() ?? [],
          rowIndex: idx,
          removeFn: remove,
          totalRows: fieldRowsRef.current.templateFieldRows.length,
        });
      });
    },
    [remove]
  );
  //clearFieldArray when clearFn is called
  const clearFieldArray = useCallback(() => {
    setFieldRows((old) => ({
      ...old,
      resetFlag: false,
      templateFieldRows: [],
      lastInsertIndex: -1,
    }));
  }, [setFieldRows]);

  const insert = useCallback(
    (index: number) => {
      const result = _insert(
        index,
        fieldRowsRef.current.templateFieldRows,
        fieldRowsRef.current.lastInsertIndex,
        templateFieldNamesRef.current
      );
      if (result !== undefined) {
        if (Array.isArray(result.newRows)) {
          setFieldRows((old) => ({
            ...old,
            lastInsertIndex: result.lastIndex,
            templateFieldRows: result.newRows,
          }));
        }
      }
    },
    [setFieldRows, _insert]
  );

  const push = useCallback(() => {
    const result = _insert(
      fieldRowsRef.current.templateFieldRows.length,
      fieldRowsRef.current.templateFieldRows,
      fieldRowsRef.current.lastInsertIndex,
      templateFieldNamesRef.current
    );
    if (result !== undefined) {
      setFieldRows((old) => ({
        ...old,
        lastInsertIndex: result.lastIndex,
        templateFieldRows: result.newRows,
      }));
    }
  }, [setFieldRows, _insert]);

  const unshift = useCallback(() => {
    const result = _insert(
      0,
      fieldRowsRef.current.templateFieldRows,
      fieldRowsRef.current.lastInsertIndex,
      templateFieldNamesRef.current
    );
    if (result !== undefined) {
      if (Array.isArray(result.newRows)) {
        setFieldRows((old) => ({
          ...old,
          lastInsertIndex: result.lastIndex,
          templateFieldRows: result.newRows,
        }));
      }
    }
  }, [setFieldRows, _insert]);

  const pop = useCallback(() => {
    remove(fieldRowsRef.current.templateFieldRows.length - 1);
  }, [remove]);

  const swap = useCallback(
    (indexA: number, indexB: number) => {
      if (
        indexA >= 0 &&
        indexA < fieldRowsRef.current.templateFieldRows.length &&
        indexB >= 0 &&
        indexB < fieldRowsRef.current.templateFieldRows.length &&
        indexA !== indexB
      ) {
        const fieldRowsCopy = fieldRowsRef.current.templateFieldRows.slice(0);
        const rowA = fieldRowsCopy[indexA];
        const rowB = fieldRowsCopy[indexB];
        for (const fieldName of templateFieldNamesRef.current ?? []) {
          const tempName = rowA.cells[fieldName].name;
          rowA.cells[fieldName].name = rowB.cells[fieldName].name;
          rowB.cells[fieldName].name = tempName;
        }
        const rowBCopy = fieldRowsCopy[indexB];
        fieldRowsCopy[indexB] = fieldRowsCopy[indexA];
        fieldRowsCopy[indexA] = rowBCopy;
        setFieldRows((oldValues) => ({
          ...oldValues,
          templateFieldRows: fieldRowsCopy,
          lastInsertIndex: oldValues.lastInsertIndex,
        }));
      }
    },
    [setFieldRows]
  );
  const move = useCallback(
    (from: number, to: number) => {
      if (
        from >= 0 &&
        from < fieldRowsRef.current.templateFieldRows.length &&
        to >= 0 &&
        to < fieldRowsRef.current.templateFieldRows.length &&
        from !== to
      ) {
        const [small, big] = from < to ? [from, to] : [to, from];
        const beginningRows = fieldRowsRef.current.templateFieldRows.slice(
          0,
          small
        );
        const endingRows = fieldRowsRef.current.templateFieldRows.slice(
          big + 1
        );
        const middleRows = fieldRowsRef.current.templateFieldRows.slice(
          small,
          big + 1
        );
        if (from < to) {
          let movingRow = middleRows.slice(0, 1)[0];
          let shiftingRows = middleRows.slice(1);
          let currentIndex = from;
          for (let fieldRow of shiftingRows) {
            for (const fieldName of templateFieldNamesRef.current ?? []) {
              fieldRow.cells[
                fieldName
              ].name = `${arrayFieldName}[${currentIndex}].${fieldName}`;
            }
            currentIndex++;
          }
          for (const fieldName of templateFieldNamesRef.current ?? []) {
            movingRow.cells[
              fieldName
            ].name = `${arrayFieldName}[${to}].${fieldName}`;
          }
          setFieldRows((oldValues) => ({
            ...oldValues,
            templateFieldRows: [
              ...beginningRows,
              ...shiftingRows,
              movingRow,
              ...endingRows,
            ],
            lastInsertIndex: oldValues.lastInsertIndex,
          }));
        } else {
          let shiftingRows = middleRows.slice(0, middleRows.length - 1);
          let movingRow = middleRows.slice(middleRows.length - 1)[0];
          let currentIndex = to + 1;
          for (let fieldRow of shiftingRows) {
            for (const fieldName of templateFieldNamesRef.current ?? []) {
              fieldRow.cells[
                fieldName
              ].name = `${arrayFieldName}[${currentIndex}].${fieldName}`;
            }
            currentIndex++;
          }
          for (const fieldName of templateFieldNamesRef.current ?? []) {
            movingRow.cells[
              fieldName
            ].name = `${arrayFieldName}[${to}].${fieldName}`;
          }
          setFieldRows((oldValues) => ({
            ...oldValues,
            templateFieldRows: [
              ...beginningRows,
              movingRow,
              ...shiftingRows,
              ...endingRows,
            ],
            lastInsertIndex: oldValues.lastInsertIndex,
          }));
        }
      }
    },
    [setFieldRows, arrayFieldName]
  );

  const getAllRowsValuesFn = useCallback(
    () => getAllRowsValues(fieldRowsRef.current.templateFieldRows),
    [getAllRowsValues]
  );

  return {
    fieldRows,
    templateFieldNames: templateFieldNamesRef.current,
    clearFieldArray,
    getAllRowsValues: getAllRowsValuesFn,
    unshift,
    push,
    insert,
    pop,
    remove,
    swap,
    move,
    renderRows,
    excluded: fieldRows.excluded,
    isSubmitting: formState.isSubmitting,
    formState: formContext.formState,
    formName: formContext.formName,
  };
};
