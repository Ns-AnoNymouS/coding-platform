import React, {useState} from "react";
import {
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  PaginationItem,
  Pagination,
  Box
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Standings = () => {
  const [totStandings, setTotStandings] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const data = [
    { name: "John Doe", age: 28, email: "john@example.com" },
    { name: "Jane Smith", age: 34, email: "jane@example.com" },
    { name: "Sam Green", age: 45, email: "sam@example.com" },
  ];

  //   const onSubmit = async (data) => {
  //     try {
  //       const response = await axios.post("http://localhost:6969/login", data, {
  //         validateStatus: (status) => {
  //           return status >= 200 && status < 500;
  //         },
  //       });
  //       if (response.data.status === "ok") {
  //         localStorage.setItem("token", response.data.token);
  //         localStorage.setItem("role", response.data.user.role);
  //         navigate("/problems");
  //       } else alert(response.data.message);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const handleOpenContest = (contestNumber) => {
    navigate(`/contest/${contestNumber}`);
  }

  return (
    <div
      className="min-h-screen bg-gray-100 text-gray-900 flex justify-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/236x/0c/84/3f/0c843f96a6e997fff64e65057100b4af.jpg')",
      }}
    >
      <div className="max-w-screen-md m-0 sm:m-10 bg-black/55 shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-2/3 xl:w-10/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button className="text-2xl xl:text-3xl font-extrabold text-white"
                onClick={handleOpenContest}>
                  Log In
                </button>
                <div className="w-full flex-1 mt-8">
                  <table className="min-w-full bg-gray-900 text-white border border-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Age
                        </th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-gray-800 hover:bg-gray-700"
                        >
                          <td className="text-left py-3 px-4">{row.name}</td>
                          <td className="text-left py-3 px-4">{row.age}</td>
                          <td className="text-left py-3 px-4">{row.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Box className="flex items-center justify-between mt-4">
            <Pagination
              count={Math.ceil(totStandings / rowsPerPage)}
              page={page + 1}
              onChange={(event, value) => setPage(value - 1)}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
            <FormControl variant="outlined" size="small" className="ml-4 w-28">
              <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                label="Rows per page"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Standings;
