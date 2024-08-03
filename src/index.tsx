import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "registry"; //register functions to be used across application
import "typeface-roboto";
import "components/multiLanguage/languagesConfiguration";
import { FullScreenLoader } from "components/common/loaderPaper";
const AUD = lazy(() => import("app/audit"));
const ErrorPage = lazy(() => import("app/error"));

const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("cbsenfinity");
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <StrictMode>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Suspense fallback={<FullScreenLoader />}>
            {/* <ErrorBoundary> */}
            <Routes>
              <Route path="cbsenfinity/*" element={<AUD />} />
              <Route path="error/*" element={<ErrorPage />} />
              <Route path="*" element={<Redirect />} />
            </Routes>
            {/* </ErrorBoundary> */}
          </Suspense>
        </BrowserRouter>
      </DndProvider>
    </StrictMode>
  );
};
const container: any = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);

//ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster,yarh some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
