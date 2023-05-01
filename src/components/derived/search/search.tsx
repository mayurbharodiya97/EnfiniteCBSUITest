import { useRef, FC, Fragment, useEffect } from "react";
import Input, { InputProps } from "@material-ui/core/Input";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useStyles } from "./style";
import SearchIcon from "@material-ui/icons/Search";
import FormHelperText, {
  FormHelperTextProps,
} from "@material-ui/core/FormHelperText";

export const SearchBar: FC<InputProps> = (props) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (Boolean(props.autoFocus)) {
      setTimeout(() => {
        inputRef.current?.focus?.();
      }, 1000);
    }
  }, []);
  return (
    <div
      className={classes.searchRoot}
      style={{ display: desktop ? "flex" : "none" }}
    >
      <Input
        {...props}
        disableUnderline
        inputRef={inputRef}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
      <div className={classes.search}>
        <SearchIcon color="secondary" />
      </div>
    </div>
  );
};

export const SearchBar2: FC<
  InputProps & FormHelperTextProps & { helperText: string }
> = ({ helperText, error, disabled, ...others }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const inputRef = useRef(null);
  return (
    <Fragment>
      <div
        className={classes.searchRoot2}
        style={{ display: desktop ? "flex" : "none" }}
      >
        <Input
          {...others}
          disabled={disabled}
          error={error}
          disableUnderline
          inputRef={inputRef}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
        <div className={classes.search}>
          <SearchIcon />
        </div>
      </div>
      {Boolean(error) ? (
        <FormHelperText
          disabled={disabled}
          error={error}
          className={classes.searchError}
        >
          {helperText}
        </FormHelperText>
      ) : null}
    </Fragment>
  );
};
