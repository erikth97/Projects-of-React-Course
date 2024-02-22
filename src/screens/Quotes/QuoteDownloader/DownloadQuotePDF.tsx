import { Modal, Box, Typography, Button, Card, IconButton } from "@mui/material";
import { IQuote } from "../../../common/Interfaces";
import { usePDF, Margin } from "react-to-pdf";
import React from "react";
import generatePDF, { Options } from "react-to-pdf";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { QuoteTemplate } from "./QuoteTemplate";

export const DownloadQuotePDF = ({
  openModal,
  closeModal,
  quote,
  name,
  email,
}: {
  openModal: boolean;
  closeModal: () => void;
  quote: IQuote;
  name: string;
  email: string;
}) => {
  const options: Options = {
    filename: "Cotización_" + quote.quote_number + ".pdf",
    page: {
      margin: 10,
    },
  };

  const getTargetElement = () => document.getElementById("container");

  const downloadPdf = () => generatePDF(getTargetElement, options);

  return (
    <Modal open={openModal} onClose={() => closeModal()}>
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif",
          backgroundColor: "#FFFFFF",
          margin: "3rem",
          color: " #4c4e52",
          fontSize: "14px",
          display: "flex",
          height: "80%",
          flexDirection: "column",
          padding: "2rem",
          borderRadius: "20px",
        }}
      >
        <div style={{ overflow: "scroll" }}>
          <div id="container">
            <QuoteTemplate quote={quote} name={name} email={email}></QuoteTemplate>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={downloadPdf}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#DB2777",
              color: "#FFFFFF",
              ":hover": {
                backgroundColor: "#E25292",
              },
              marginRight: "10px",
              fontSize: "12px",
            }}
          >
            Descargar cotización
          </Button>
          <Button
            onClick={() => closeModal()}
            variant="contained"
            startIcon={<CloseIcon />}
            sx={{
              backgroundColor: "#DB2777",
              color: "#FFFFFF",
              ":hover": {
                backgroundColor: "#E25292",
              },
              fontSize: "12px",
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
