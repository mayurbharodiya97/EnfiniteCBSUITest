import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import romanian from "assets/images/romania.png";
import chinese from "assets/images/china.png";
import english from "assets/images/united-states.png";
import french from "assets/images/france.png";
import { useStyles } from "./style";
import { FormControl, Select, MenuItem } from "@mui/material";
export const Language_App = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState("");

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <>
      <FormControl size="small" style={{ margin: " 0 15px 0 25px" }}>
        <Select
          style={{
            maxWidth: "100px",
            width: "100px",
          }}
          disableUnderline
          variant="standard"
          value={language}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem style={{ width: "150px" }} value="">
            <div key="Language" style={{ display: "flex" }}>
              <img src={english} alt="" className={classes.lang_svg} />
              English
            </div>
          </MenuItem>

          <MenuItem value="romanian" style={{ position: "static" }}>
            <div key="Language" style={{ display: "flex" }}>
              <img src={romanian} alt="" className={classes.lang_svg} /> Roman
            </div>
          </MenuItem>
          <MenuItem value="french">
            <div key="Language" style={{ display: "flex" }}>
              <img src={french} alt="" className={classes.lang_svg} />
              French
            </div>
          </MenuItem>
          <MenuItem value="chinese">
            <div key="" style={{ display: "flex" }}>
              <img src={chinese} alt="" className={classes.lang_svg} />
              Chinese
            </div>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
