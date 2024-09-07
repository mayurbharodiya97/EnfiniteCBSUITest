import { useState, useCallback, useEffect, useRef } from "react";
import { TextField, TextFieldProps } from "components/common/textField";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// const PasswordField: React.FC<TextFieldProps> = ({
//   allowToggleVisiblity,
//   ...others
// }) => {
//   const [passwordVisibility, setPasswordVisibility] = useState(false);
//   const handleVisibility = useCallback(() => {
//     setPasswordVisibility((old) => !old);
//   }, [setPasswordVisibility]);
//   return (
//     <TextField
//       {...others}
//       type={passwordVisibility ? "text" : "password"}
//       InputProps={{
//         endAdornment: Boolean(allowToggleVisiblity) ? (
//           <InputAdornment position="end">
//             <IconButton
//               sx={{ mr: 1 }}
//               aria-label="toggle password visibility"
//               onClick={handleVisibility}
//               edge="end"
//               tabIndex={-1}
//             >
//               {passwordVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
//             </IconButton>
//           </InputAdornment>
//         ) : null,
//       }}
//     />
//   );
// };

// chnages by parag for visible off after some time
const PasswordField: React.FC<TextFieldProps> = ({
  allowToggleVisiblity,
  ...others
}) => {
  const [showPasswordTime, setShowPasswordTime] = useState(0);
  const passwordVisibility = Date.now() < showPasswordTime;
  const timerRef = useRef<any>(null);
  const [, forceUpdate] = useState<any | null>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  return (
    <TextField
      {...others}
      type={passwordVisibility ? "text" : "password"}
      InputProps={{
        endAdornment: Boolean(allowToggleVisiblity) ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                if (!passwordVisibility) {
                  setShowPasswordTime(Date.now() + 5000);
                  timerRef.current = setTimeout(
                    () => forceUpdate(Date.now()),
                    5000
                  );
                } else if (passwordVisibility) setShowPasswordTime(0);
              }}
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
