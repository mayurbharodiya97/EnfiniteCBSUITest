<Dialog
  PaperProps={{
    style: {
      width: "100%",
      minHeight: "46vh",
    },
  }}
  open={open}
  // onClose={handleClose}
  maxWidth="md"
  scroll="body"
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    Joint Full View for: Test Customer
  </DialogTitle>
  <IconButton
    aria-label="close"
    onClick={handleClose}
    sx={{
      position: "absolute",
      right: 8,
      top: 8,
      color: (theme) => theme.palette.grey[500],
    }}
  >
    <CloseIcon />
  </IconButton>
  <DialogContent>
    <div
      style={{
        boxShadow: "0px 1px 4px -1px #999999",
        borderRadius: "5px",
        margin: "10px",
        padding: "10px",
      }}
    >
      <FormWrapper
        metaData={jointViewDetailMetaData}
        // onSubmitHandler={onSubmitHandler}
        onFormButtonClickHandel={onConfirmFormButtonClickHandel}
        hideHeader={true}
        displayMode={"new"}
        formStyle={{
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      ></FormWrapper>
    </div>
  </DialogContent>
  <DialogActions></DialogActions>
</Dialog>;
