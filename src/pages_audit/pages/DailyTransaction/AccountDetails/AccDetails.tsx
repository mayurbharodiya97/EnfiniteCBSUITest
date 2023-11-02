import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AccDetails = () => {
  return (
    <>
      <div
        style={{
          height: "44vh",
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Card
          sx={{
            width: "400px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography variant="h5" component="div">
                Personal Information
              </Typography>
              <div>
                <AccountCircleIcon />
              </div>
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "35vh" }}>
              <Typography component="div">Name</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "400px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography variant="h5" component="div">
                Personal Information
              </Typography>
              <div>
                <AccountCircleIcon />
              </div>
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "35vh" }}>
              <Typography component="div">Name</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>adjective</Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccDetails;
