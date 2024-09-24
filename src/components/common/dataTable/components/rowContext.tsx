import {
  createContext,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";

/* eslint-disable  react-hooks/exhaustive-deps */
export const RowContext = createContext<any>({});

export const RowContextProvider = forwardRef<any, any>(
  (
    {
      currentRowError,
      currentRowObj,
      children,
      initialData,
      rowValidator,
      setFormError,
      prevRows,
      nextRows,
    },
    ref
  ) => {
    const initialTouched = useMemo(() => {
      let touchedObj = {};
      for (const one in initialData) {
        touchedObj[one] = false;
      }
      return touchedObj;
    }, []);
    const [error, setError] = useState({});
    const [isError, setIsError] = useState(false);
    const [currentRow, setCurrentRow] = useState(initialData);
    const [touched, setTouched] = useState(initialTouched);

    const touchAll = useCallback(() => {
      let touchAll = {};
      for (const one in initialTouched) {
        touchAll[one] = true;
      }
      setTouched(touchAll);
    }, [initialTouched]);

    useImperativeHandle(ref, () => ({
      touchAll: touchAll,
    }));

    const setCellValue = useCallback((value) => {
      setCurrentRow((old) => {
        let result = { ...old, ...value };
        currentRowObj.current = result;
        return result;
      });
    }, []);

    const setCellTouched = useCallback((value) => {
      setTouched((old) => {
        let result = { ...old, ...value };
        return result;
      });
    }, []);

    useEffect(() => {
      const executeValidation = async (obj, prevRows, nextRows) => {
        try {
          await rowValidator(obj, prevRows, nextRows);
          setError({});
          setIsError(false);
          currentRowError.current = {};
        } catch (e: any) {
          setError(e);
          setIsError(true);
          currentRowError.current = e;
        }
      };
      executeValidation(currentRow, prevRows, nextRows);
    }, [currentRow]);

    useEffect(() => {
      isError ? setFormError("has error") : setFormError("");
    }, [isError]);

    useEffect(() => {
      return () => {
        setFormError("");
      };
    }, []);

    return (
      <RowContext.Provider
        value={{ error, currentRow, setCellValue, touched, setCellTouched }}
      >
        {children}
      </RowContext.Provider>
    );
  }
);
