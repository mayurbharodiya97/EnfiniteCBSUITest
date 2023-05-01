import { useState, useRef, useCallback } from "react";
import { ChipTextField } from "components/styledComponent/textfield";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";

const getChipProps = (index) => ({
  "data-tag-index": index,
  tabIndex: -1,
  key: index,
});

export const MultiValueFilter = ({
  filterValue,
  id,
  columnName,
  gridProps,
  dispatch,
}) => {
  const [text, setText] = useState("");
  const [chips, setChips] = useState<any>(filterValue?.value ?? []);
  const [focusedTag, setFocusedTag] = useState(-1);
  const anchorElRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const handleFocusTag = (event, direction) => {
    let nextTag = focusedTag;
    if (focusedTag === -1) {
      if (text === "" && direction === "previous") {
        nextTag = chips.length - 1;
      }
    } else {
      nextTag += direction === "next" ? 1 : -1;
      if (nextTag < 0) {
        nextTag = 0;
      }
      if (nextTag === chips.length) {
        nextTag = -1;
      }
    }
    setFocusedTag(nextTag);
    focusTag(nextTag);
  };

  const focusTag = useCallback((tagToFocus) => {
    if (tagToFocus === -1) {
      inputRef.current.focus();
    } else {
      anchorElRef.current
        .querySelector(`[data-tag-index="${tagToFocus}"]`)
        .focus();
    }
  }, []);

  let startAdornment: any = null;
  if (Array.isArray(chips) && chips.length > 0) {
    startAdornment = chips.map((one, index) => {
      return (
        <Chip
          label={one}
          size="small"
          onDelete={() =>
            setChips([
              ...chips.slice(index, index + 1),
              ...chips.slice(index + 1),
            ])
          }
          style={{ margin: "4px 2px" }}
          {...getChipProps(index)}
        />
      );
    });
  }
  const handleBlur = () => {
    if (Array.isArray(chips) && chips.length > 0) {
      dispatch({
        type: "setValue",
        payload: {
          condition: "in",
          value: chips,
          id,
          columnName,
        },
      });
    } else {
      dispatch({
        type: "removeValue",
        payload: {
          id,
        },
      });
    }
  };

  return (
    <Grid item xs={12} sm={6} md={6} {...gridProps}>
      <ChipTextField
        inputRef={inputRef}
        label={columnName}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        fullWidth
        value={text}
        InputProps={{
          startAdornment: startAdornment,
          ref: anchorElRef,
        }}
        onKeyDown={(event) => {
          if (
            focusedTag !== -1 &&
            ["ArrowLeft", "ArrowRight"].indexOf(event.key) === -1
          ) {
            setFocusedTag(-1);
            focusTag(-1);
          }
          if (event.which !== 299) {
            switch (event.key) {
              case "Enter": {
                if (Boolean(text)) {
                  setChips((all) => [...all, text]);
                  setText("");
                }
                break;
              }
              case "Backspace": {
                if (text === "" && chips.length > 0) {
                  const indexToRemove =
                    focusedTag === -1 ? chips.length - 1 : focusedTag;
                  const newChips = chips.slice();
                  newChips.splice(indexToRemove, 1);
                  setChips(newChips);
                }
                break;
              }
              case "ArrowLeft": {
                handleFocusTag(event, "previous");
                break;
              }
              case "ArrowRight": {
                handleFocusTag(event, "next");
                break;
              }
            }
          }
        }}
      />
    </Grid>
  );
};

/*

*/
