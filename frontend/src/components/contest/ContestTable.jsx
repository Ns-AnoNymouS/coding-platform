import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableComponent = ({ columns, rows, titleAsLink, registrationStatus }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        overflow: 'hidden',
      }}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <StyledTableCell
                key={index}
                align={column.align || "left"}
                sx={{ width: column.width || 'auto' }} // Apply variable width
              >
                {column.id === "title" && titleAsLink ? (
                  <Link href="#" color="inherit" underline="none">
                    {column.label}
                  </Link>
                ) : (
                  column.label
                )}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              {columns.map((column, colIndex) => (
                <StyledTableCell
                  key={colIndex}
                  align={column.align || "left"}
                  sx={{ width: column.width || 'auto' }} // Apply variable width
                >
                  {(column.id === "name" || column.id === "title") && titleAsLink ? (
                    <Link href="#" color="inherit" underline="none">
                      {row[column.id]}
                    </Link>
                  ) : column.id === "register" ? (
                    <Button
                      variant="contained"
                      disabled={registrationStatus}
                      sx={{ backgroundColor: registrationStatus ? '#f5f5f5' : '#1976d2', color: '#000' }}
                    >
                      {registrationStatus ? "Registered" : "Register"}
                    </Button>
                  ) : (
                    row[column.id]
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
