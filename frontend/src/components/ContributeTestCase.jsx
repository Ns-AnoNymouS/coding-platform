import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, TextField, Typography, Button, Autocomplete } from "@mui/material";
import axios from "axios";

const schema = yup
  .object({
    problemName: yup.string().required("Problem Name is required"),
    input: yup.string().required("Input is required"),
    output: yup.string().required("Output is required"),
  })
  .required();

const ContributeTestCase = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      problemName: null,  // Initial value set to null
      input: "",
      output: "",
    },
  });

  useEffect(() => {
    const getAllProblems = async () => {
      try {
        const response = await axios.get("http://localhost:6969/all-problems", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProblems(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllProblems();
  }, []);

  const onSubmit = async (data) => {
    console.log(selectedProblem);
    try {
      const formattedData = {
        problemNumber: selectedProblem?.problem_id,
        givenInput: data.input,
        correctOutput: data.output,
      };
      console.log(formattedData);
      const response = await axios.post(
        "http://localhost:6969/add-pending-test-case",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.data.status === "ok") {
        alert("Test cases Submitted for verification");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while adding the test cases");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        padding: 2,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Contribute Test Case
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Controller
            name="problemName"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={problems}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) =>
                  option.title === value || value === ""
                }
                onChange={(_, newValue) => {
                  field.onChange(newValue ? newValue.title : null);
                  setSelectedProblem(newValue);
                }}
                value={selectedProblem || null} // Ensure correct value is used
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Problem Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.problemName}
                    helperText={errors.problemName?.message}
                  />
                )}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="input"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Input"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.input}
                helperText={errors.input?.message}
                placeholder={`Sample Input:\n4\n2 3 4\n4 5 6\n7 8 9\n15 12 46`}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="output"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Output"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.output}
                helperText={errors.output?.message}
                placeholder={`Sample Output:\n10\n20\n30\n40`}
              />
            )}
          />
        </Box>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContributeTestCase;
