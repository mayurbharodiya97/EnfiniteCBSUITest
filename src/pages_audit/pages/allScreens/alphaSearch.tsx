import { Box, Grid, Typography } from "@mui/material";
import { Dispatch, FC, useMemo, useState } from "react";

interface LetterSearchTypes {
  dataList: object[];
  setScreens: Dispatch<any>;
}

export const LetterSearch: FC<LetterSearchTypes> = ({
  dataList,
  setScreens,
}) => {
  const [isActive, setActive] = useState({
    letter: "",
    active: false,
  });

  const letterList = useMemo(() => {
    setActive({
      letter: "",
      active: false,
    });
    const letterList: string[] = [];
    dataList?.filter((data: any) => {
      if (data.DOC_TITLE) {
        const firstChar: any = data.DOC_TITLE.at(0).toUpperCase();
        if (firstChar) {
          if (!letterList.includes(firstChar)) {
            letterList.push(firstChar);
          }
        }
      }
    });
    letterList.sort();
    return letterList;
  }, [dataList]);

  return (
    <Grid container sx={{ background: "var(--theme-color4)" }}>
      {letterList.map((letter) => (
        <Grid item>
          <Box
            onClick={() => {
              const currData = dataList;
              if (isActive.letter === letter && isActive.active) {
                setActive({
                  active: false,
                  letter: "",
                });
                setScreens(currData);
                return;
              } else {
                setActive({
                  active: true,
                  letter: letter,
                });
              }
              const filterdData = currData.filter(
                (row: any) => row?.DOC_TITLE?.at(0)?.toUpperCase() === letter
              );
              setScreens(filterdData);
            }}
            sx={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: "2px",
              boxShadow: "0 0 0 0.2px var(--theme-color3)",
              backgroundColor:
                isActive.active && isActive.letter === letter
                  ? "var(--theme-color1)"
                  : "var(--theme-color2)",
              color:
                isActive.active && isActive.letter === letter
                  ? "var(--theme-color4)"
                  : "var(--theme-color3)",
              cursor: "pointer",
              mr: "5px",
              borderRadius: "3px",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "var(--theme-color3)",
                color: "var(--theme-color4)",
              },
            }}
          >
            <Typography>{letter}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
