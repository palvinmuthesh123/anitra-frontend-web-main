import { Grid } from "@mui/material";
import CustomButton from "../components/Button";
import { apiRequest } from "../services/api-request";
import { Colors } from "../constants/Colors";

export const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });

  console.log(data, fileName, fileType, blob, "PPPPPPPPPPPPPPPPPPPP")

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export const exportToCsv = (apiUrl, fileName, headers, errorCallback) => {
  return apiRequest({
    url: apiUrl,
    method: "GET",
  })
    .then((res) => {
      if (!res || !res.data || res.data.length === 0) {
        errorCallback("No data available");
        return null;
      }

      const dataHeaders = headers.join(",");
      const fields = Object.keys(res.data[0]);

      const data = res.data.reduce((acc, user) => {
        const rowData = fields.map((field) => user[field]);
        acc.push(rowData.join(","));
        return acc;
      }, []);

      return [dataHeaders, ...data].join("\n");
    })
    .catch((err) => {
      errorCallback(err);
      return null;
    });
};

export const downloadCsvFile = (csvData, fileName) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const ExportButton = (props) => {
  return (
    <>
      <Grid container justifyContent={"end"}>
        <CustomButton
          title={"Export List"}
          handleButtonClick={props.export}
          backgroundColor={Colors.headerColor}
          textColor={Colors.white}
          textFontSize={14}
          padding={"5px 10px"}
        />
      </Grid>
    </>
  );
};
