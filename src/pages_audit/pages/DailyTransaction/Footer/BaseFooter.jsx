import { Button, Toolbar, AppBar, Card } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { useMutation, useQuery } from "react-query";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import "./footer.css";

const BaseFooter = ({ rows }) => {
  let filterOpt = [
    { label: "Scroll search", value: "scroll" },
    { label: "Vno search", value: "vno" },
  ];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ value: "", label: "" });

  const handleSearch = (e) => {
    let txt = e.target.value;
    setSearch(txt);
    const obj = [...rows];
    if (filter.value == "scroll") {
      obj.map((a, j) => {
        if (txt && txt == a.scroll) {
          a.isFav = true;
        } else {
          a.isFav = false;
        }
      });
    }
    if (filter.value == "vno") {
      obj.map((a, j) => {
        if (txt && txt == a.vNo) {
          a.isFav = true;
        } else {
          a.isFav = false;
        }
      });
    }

    // setRows(obj);
  };

  const handleFilter = (e, value) => {
    setSearch("");
    setFilter(value);
    const obj = [...rows];
    obj.map((a) => {
      a.isFav = false;
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sx={{ width: 180 }}>
          <Autocomplete
            value={filter}
            size="small"
            options={filterOpt}
            onChange={(e, value) => handleFilter(e, value)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item>
          <div id="searchContainer">
            <SearchIcon style={{ margin: "5px" }} />
            <input
              disabled={filter?.value ? false : true}
              placeholder="Search.."
              id="searchField"
              // type="number"
              value={search}
              onChange={(e) => handleSearch(e)}
            />
          </div>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            View All
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Calculator
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Delete
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            refresh
          </Button>{" "}
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            scroll del
          </Button>{" "}
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            other a/c
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            other Tx Detail
          </Button>
        </Grid>{" "}
      </Grid>
    </>
  );
};

export default BaseFooter;
