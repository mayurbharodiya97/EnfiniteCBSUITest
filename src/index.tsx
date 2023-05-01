import { StrictMode, useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "registry"; //register functions to be used across application
import "components/tableCellComponents"; //register table cell components
import "typeface-roboto";
import { FullScreenLoader } from "components/common/loaderPaper";
const AUD = lazy(() => import("app/audit"));
const ErrorPage = lazy(() => import("app/error"));

require("dotenv").config();
const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("netbanking");
  }, [navigate]);
  return null;
};
const App = () => (
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Suspense fallback={<FullScreenLoader />}>
          {/* <ErrorBoundary> */}
          <Routes>
            <Route path="netbanking/*" element={<AUD />} />
            <Route path="error/*" element={<ErrorPage />} />
            <Route path="*" element={<Redirect />} />
          </Routes>
          {/* </ErrorBoundary> */}
        </Suspense>
      </BrowserRouter>
    </DndProvider>
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster,yarh some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
