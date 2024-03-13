import { useState, useCallback } from "react";
import { TextField, TextFieldProps } from "components/common/textField";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordField: React.FC<TextFieldProps> = ({
  allowToggleVisiblity,
  ...others
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const handleVisibility = useCallback(() => {
    setPasswordVisibility((old) => !old);
  }, [setPasswordVisibility]);
  return (
    <TextField
      {...others}
      type={passwordVisibility ? "text" : "password"}
      InputProps={{
        endAdornment: Boolean(allowToggleVisiblity) ? (
          <InputAdornment position="end">
            <IconButton
              sx={{ mr: 1 }}
              aria-label="toggle password visibility"
              onClick={handleVisibility}
              edge="end"
              tabIndex={-1}
            >
              {passwordVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default PasswordField;
