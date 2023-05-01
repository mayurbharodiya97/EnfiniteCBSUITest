import {
  unstable_createMuiStrictModeTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { SnackbarProvider } from "notistack";
import { queryClient } from "cache";
import "registry/fns/registerFnsNetBanking";
// import "components/tableCellComponents";
import IndexPage from "pages_audit";
import { theme } from "./theme";
import "./index.css";

const themeObj = unstable_createMuiStrictModeTheme(theme);

export const App = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={themeObj}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            {/* <h1>Hello</h1> */}
            <IndexPage />
          </SnackbarProvider>
          {process.env.NODE_ENV !== "production" ? (
            <ReactQueryDevtools />
          ) : null}
        </QueryClientProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};
