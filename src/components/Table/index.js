import * as React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Colors } from "../../constants/Colors";

export default function CustomTable(props) {
  const { headerData } = props;
  return (
    <Table aria-label="simple table" size={"small"}>
      <TableHead sx={styles.tableHeaderContainer}>
        <TableRow>
          {headerData.map((item) => {
            return (
              <TableCell key={item.id} className={props.className}>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                >
                  {item.title}
                </Typography>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>{props.children}</TableBody>
    </Table>
  );
}

const styles = {
  tableHeaderContainer: { backgroundColor: Colors.tableHEaderBg },
};
