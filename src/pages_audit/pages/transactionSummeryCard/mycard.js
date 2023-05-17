import React from "react";
import "./imagecarousel.css";
import {
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
const Mycard = (props) => {
  return (
    // <div className='mycard'>Mycard No. {props.cardno}</div>
    <Card
      sx={{
        color: "white",
        minWidth: 372,
        mx: 2,
        my: 4,
        background: "linear-gradient(61.76deg, #4285F4 8.02%, #885DF5 108.35%)",
        borderRadius: "20px",
      }}
    >
      <CardContent>
        <Typography ml={1} variant="h5" align="left" component="div">
          {props.cardno}
        </Typography>
        <Table sx={{ minWidth: 374 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ p: 1, color: "white" }}>Type</TableCell>
              <TableCell sx={{ p: 1, color: "white" }}>Amount</TableCell>
              <TableCell sx={{ p: 1, color: "white" }}>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{ p: 1, color: "white", border: "none" }}
                component="th"
                scope="row"
              >
                qwe
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                asd
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                zxc
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ p: 1, color: "white", border: "none" }}
                component="th"
                scope="row"
              >
                qwe
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                asd
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                zxc
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ p: 1, color: "white", border: "none" }}
                component="th"
                scope="row"
              >
                qwe
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                asd
              </TableCell>
              <TableCell sx={{ p: 1, color: "white", border: "none" }}>
                zxc
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Mycard;
