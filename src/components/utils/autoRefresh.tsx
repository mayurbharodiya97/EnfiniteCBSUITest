import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";

export const AutoRefreshContext = createContext({
  resume: () => {},
  pause: () => {},
  attachFunction: (cb, isEnabled) => {},
});

export const AutoRefreshProvider = ({ children }) => {
  let timer = useRef<any>(null);
  let callbackRef = useRef<any>(null);
  let isEnabledRef = useRef<any>(false);
  let isTimerRunning = useRef<any>(false);

  const resume = useCallback(() => {
    if (Boolean(isEnabledRef.current) && !Boolean(isTimerRunning.current)) {
      timer.current = setInterval(() => {
        if (typeof callbackRef?.current === "function") {
          callbackRef.current();
        }
      }, 1000);
      isTimerRunning.current = true;
    }
  }, []);

  const pause = useCallback(() => {
    if (Boolean(isEnabledRef.current && Boolean(isTimerRunning.current))) {
      clearInterval(timer.current);
      isTimerRunning.current = false;
    }
  }, []);

  const attachFunction = (cb, isEnabled) => {
    callbackRef.current = cb;
    isEnabledRef.current = isEnabled;
  };

  return (
    <AutoRefreshContext.Provider value={{ resume, pause, attachFunction }}>
      {children}
    </AutoRefreshContext.Provider>
  );
};

export const useAutoRefreshControls = () => {
  const { resume, pause } = useContext(AutoRefreshContext);
  return { resume, pause };
};

export const useAutoRefresh = (callback, intervalInSeconds) => {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const interval = useRef<any>(0);
  const cb = useRef(callback);
  cb.current = callback;
  const { resume, pause, attachFunction } = useContext(AutoRefreshContext);

  const runner = useCallback(() => {
    interval.current = Math.min(interval.current + 1, intervalInSeconds);
    let progress = Math.floor((interval.current / intervalInSeconds) * 100);
    if (interval.current === intervalInSeconds) {
      interval.current = 0;
    }
    setProgress(Math.min(progress, 100));
  }, [setProgress, intervalInSeconds]);

  /* eslint-disable  react-hooks/exhaustive-deps */
  useEffect(() => {
    if (parseInt(intervalInSeconds) > 0) {
      attachFunction(runner, true);
      setEnabled(true);
      resume();
    }
    return () => {
      pause();
    };
  }, [intervalInSeconds, runner]);

  useEffect(() => {
    if (progress === 100) {
      if (typeof cb.current === "function") {
        cb.current();
      }
    }
  }, [progress]);

  return {
    intervalElapsed: Math.min(
      intervalInSeconds - interval.current,
      intervalInSeconds
    ),
    enabled,
    progress,
    resume,
    pause,
  };
};
