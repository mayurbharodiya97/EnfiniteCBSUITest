import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from "react-query";
import * as API from "./api";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const AccDetails = () => {
  const {
    data: accInfo,
    isSuccess: isAccTypeSuccess,
    isLoading: isAccTypeLoading,
  } = useQuery(["getAccInfo", {}], () => API.getAccInfo());

  console.log(accInfo, "accInfo");
  return (
    <>
      <Carousel responsive={responsive}>
        <Card
          sx={{
            width: "450px",
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
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Address</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Account No</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Phone</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Pan</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Id</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "450px",
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
                Balance Details
              </Typography>
              <div>
                <AccountCircleIcon />
              </div>
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "35vh" }}>
              <Typography component="div">Opening</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Shadow</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Clearing Chq</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Current</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "450px",
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
                Loan Details
              </Typography>
              <div>
                <AccountCircleIcon />
              </div>
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "35vh" }}>
              <Typography component="div">Inst Amt</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Inst Start</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Disburse amt</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Total debit in amt</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Sanction date</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">Last Statement</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "450px",
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
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
            </div>
          </CardContent>
        </Card>
      </Carousel>
    </>
  );
};

export default AccDetails;
