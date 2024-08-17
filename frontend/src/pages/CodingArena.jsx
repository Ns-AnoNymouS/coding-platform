import React, { useState, useEffect, useContext } from "react";
import { Grid, Box, IconButton, Tabs, Tab, Button, CircularProgress } from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import OutputModal from "../components/OutputModal";
import { useParams } from "react-router-dom";
import { customStyles } from "../constants/customStyles";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import LoginModal from "../components/LoginModal";
import useLanguage from "../hooks/useLanguage";
import Output from "../components/codingArena/Output";
import CloseIcon from "@mui/icons-material/Close";
import LanguagesDropdown from "../components/Editor/LanguagesDropdown";
import CodeEditorWindow from "../components/Editor/CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";

const CodingArena = () => {
  const [problemData, setProblemData] = useState({});
  const { problem_id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [readyForRender, setReadyForRender] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [outputVisible, setOutputVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);
  const [outputData, setOutputData] = useState({});
  const [examples, setExamples] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]); // Track language locally
  const [dataFetched, setDataFetched] = useState(false); // Track data fetch status
  const [loading, isLoading] = useState(false);

  // Use the custom hook for language management
  const { changeLanguage } = useLanguage(languageOptions[0]);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/problem/${problem_id}`
        );

        if (response.data.status === "ok") {
          setProblemData(response.data.data);
          setExamples(response.data.data.examples);
          setReadyForRender(true);
        } else {
          setProblemData({
            Error: "Cannot Find Problem, Go back to home page.",
          });
        }
        setDataFetched(true); // Mark data as fetched
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setProblemData({ Error: "An error occurred. Please try again later." });
        setDataFetched(true); // Mark data as fetched
      }
    };

    fetchProblemData();
  }, [problem_id]);

  useEffect(() => {

    if (dataFetched) {
      changeLanguage(language);
    }
  }, [dataFetched, language, changeLanguage]);

  // Handle language selection change
  const onSelectChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    console.log("language "+language.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSave = async () => {
    const formData = {
      language: language.value,
      code: btoa(code),
      problemNumber: problem_id,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:6969/save-code",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.status === 200) {
        console.log("Code saved successfully!");
      } else {
        console.error("Failed to save code.");
      }
    } catch (error) {
      console.error("An error occurred while saving the code.");
    }
  };

  const fetchCode = async (selectedLanguage) => {
    try {
      const response = await axios.get(`http://127.0.0.1:6969/get-saved-code?language=${selectedLanguage}&problemNumber=${problem_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code) {
        setCode(response.data.code); 
      } else {
        setCode(""); 
      }
    } catch (err) {
      console.log(err);
      setCode(""); 
    }
  };

  useEffect(() => {
    fetchCode(language.value);
  }, [language]);

  const handleRunClick = async () => {
    if (isLoggedIn) {
      const inputData = examples.map((example) => example.givenInput);

      let results = [];

      try {
        for (let i = 0; i < inputData[0].length; i++) {
          console.log(code);
          const data = {
            language: language.value,
            code: btoa(code),
            input: btoa(examples[0].givenInput[i]),
            expectedOutput: examples[0].correctOutput[i],
          };
          isLoading(true);
          const response = await axios.post(
            "http://localhost:6969/run-arena-code",
            data,
            {
              validateStatus: (status) => status >= 200 && status < 500,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          results.push({
            input: examples[0].givenInput[i],
            output: response.data.output,
            expectedOutput: examples[0].correctOutput[i],
            passed: response.data.passed,
          });
        }

        setOutputData(results);
        setOutputVisible(true);
      } catch (error) {
        console.error("Error running code:", error);
        setOutputData({
          input: [],
          output: [],
          expectedOutput: [],
          message: "An error occurred while running the code.",
          passed: "0/0",
        });
        setOutputVisible(true);
      } finally{
        isLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitClick = async () => {
    if (isLoggedIn) {
      const data = {
        language: language.value,
        code: btoa(code),
        problemNumber: problem_id,
      };

      try {
        isLoading(true);
        const response = await axios.post(
          "http://localhost:6969/submit-code",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            validateStatus: (status) => status >= 200 && status < 500,
          }
        );

        const {
          status,
          input,
          output,
          expectedOutput,
          message,
          passed,
          testcases,
        } = response.data;

        setIsSubmission(true);
        setSubmitVisible(true);
        setOutputData({
          status: status || "",
          input: input || "",
          output: output || "",
          expectedOutput: expectedOutput || "",
          testcases: testcases || "",
          message: message || "",
          passed: passed || "",
        });
      } catch (error) {
        console.error("Error submitting code:", error);
        setOutputData({
          input: "",
          output: "",
          expectedOutput: "",
          message: "An error occurred while submitting the code.",
          passed: "0/0",
        });
        setSubmitVisible(true);
      } finally{
        isLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitClose = () => {
    setSubmitVisible(false);
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const onChange = (action, data) => {
    if (action === "code") {
      setCode(data);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return <Solutions solutions={solutions} />;
      case 2:
        return <Submissions submissions={submissions} />;
      case 0:
      default:
        return readyForRender && problemData && Object.keys(problemData).length > 0 ? (
          <ProblemStatement
            title={problemData.title || ""}
            description={problemData.description || ""}
            constraints={problemData.constraints || []}
            examples={problemData.examples || []}
            tags={problemData.tags || []}
            outputVisible={outputVisible}
            difficulty={problemData.difficulty || ""}
          />
        ) : (
          <Box sx={{ padding: 2 }}>
            <p>Loading or Error occurred. Please try again later.</p>
          </Box>
        );
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ maxHeight: "100vh", padding: 2 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="Tabs for Problem, Solutions, and Submissions"
                  sx={{ marginBottom: 2 }}
                >
                  <Tab
                    label="Problem"
                    sx={{
                      bgcolor: currentTab === 0 ? "#8888" : "gray",
                      color: currentTab === 0 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 0 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                  <Tab
                    label="Solutions"
                    sx={{
                      bgcolor: currentTab === 1 ? "#8888" : "gray",
                      color: currentTab === 1 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 1 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                  <Tab
                    label="Submissions"
                    sx={{
                      bgcolor: currentTab === 2 ? "#8888" : "gray",
                      color: currentTab === 2 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 2 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                </Tabs>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                {renderContent()}
              </Box>

              {outputVisible && (
                <Box
                  sx={{
                    height: "30vh",
                    overflowY: "auto",
                    position: "absolute",
                    top: "65%",
                    width: "100%",
                    border: "none",
                    boxShadow: "none",
                    padding: 1,
                    marginTop: 2,
                  }}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                    onClick={handleOutputClose}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Output
                    results={outputData}
                    onClose={handleOutputClose}
                    isSubmission={isSubmission}
                  />
                </Box>
              )}

              {submitVisible && (
                <OutputModal
                  open={submitVisible}
                  onClose={handleSubmitClose}
                  outputData={outputData}
                />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flex flex-row">
            <div className="px-4 py-2">
              <LanguagesDropdown onSelectChange={onSelectChange} />
            </div>
          </div>
          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          border: 0,
          marginRight: 2,
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      >
        <Button
        sx={{
          ...customStyles.control,
          width: "auto",
          maxWidth: "none",
          padding: "6px 12px",
          marginRight: 1,
          border: "none",
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            cursor: "pointer",
            color: "black",
          },
          position: "relative", // For positioning the spinner
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        variant="text"
        onClick={handleSave}
        disabled={loading} // Disable button while loading
      >
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              color: "white",
            }}
          />
        )}
        {!loading && "Save"}
      </Button>

      <Button
        sx={{
          ...customStyles.control,
          width: "auto",
          maxWidth: "none",
          padding: "6px 12px",
          marginRight: 1,
          border: "none",
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            cursor: "pointer",
            color: "black",
          },
          position: "relative", // For positioning the spinner
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        variant="text"
        onClick={handleRunClick}
        disabled={loading} // Disable button while loading
      >
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              color: "white",
            }}
          />
        )}
        {!loading && "Run"}
      </Button>

      <Button
        sx={{
          ...customStyles.control,
          width: "auto",
          maxWidth: "none",
          padding: "6px 12px",
          marginRight: 1,
          border: "none",
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            cursor: "pointer",
            color: "black",
          },
          position: "relative", // For positioning the spinner
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        variant="text"
        onClick={handleSubmitClick}
        disabled={loading} // Disable button while loading
      >
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              color: "white",
            }}
          />
        )}
        {!loading && "Submit"}
      </Button>
      </Box>
      {!isLoggedIn && (
        <LoginModal open={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CodingArena;
