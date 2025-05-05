import React, { useState, useContext } from "react";
import Sidebar from "../sidebar/sidebar";
import { questionService } from "../../services/api";
import { AppContext } from "../../context/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./gen.css";
import { useNavigate } from "react-router-dom";

const GeneratePaper = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [slidersTouched, setSlidersTouched] = useState(false);
  // Initial form state with all required parameters
  const [formData, setFormData] = useState({
    subjectName: "",
    department: state.user?.department || "",
    topics: [],
    totalMarks: 100,
    duration: 180,
    includeFormula: true,
    includeDiagrams: true,
    includeAnswerKey: true,
    sections: [
      {
        name: "Multiple Choice Questions",
        questionType: "mcq",
        numQuestions: 10,
        marksPerQuestion: 2,
      },
      {
        name: "Short Answer Questions",
        questionType: "descriptive",
        numQuestions: 5,
        marksPerQuestion: 5,
      },
      {
        name: "Programming Questions",
        questionType: "programming",
        numQuestions: 3,
        marksPerQuestion: 10,
      },
      {
        name: "Numerical Problems",
        questionType: "numerical",
        numQuestions: 5,
        marksPerQuestion: 4,
      },
    ],
    difficultyDistribution: {
      easy: 30,
      medium: 50,
      hard: 20,
    },
    cognitiveDistribution: {
      remember: 20,
      understand: 30,
      apply: 30,
      analyze: 20,
    },
    practicalTheoretical: {
      theoretical: 60,
      practical: 40,
    },
    // Legacy fields kept for compatibility
    questionTypes: {
      mcq: true,
      numerical: true,
      descriptive: true,
      programming: true,
    },
    customTopic: "",
    numSections: 4,
  });

  // Predefined lists for dropdowns
  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical",
    "Biotechnology",
  ];
  const year = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  const commonTopics = {
    "Computer Science": [
      "Data Structures",
      "Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "Web Development",
      "Machine Learning",
    ],
    "Information Technology": [
      "Web Technologies",
      "Cloud Computing",
      "Information Security",
      "Data Mining",
      "Mobile Application Development",
      "IoT",
      "ARM",
    ],
    Electronics: [
      "Digital Electronics",
      "Microprocessors",
      "Signal Processing",
      "Communication Systems",
      "VLSI Design",
      "Embedded Systems",
    ],
    Mechanical: [
      "Thermodynamics",
      "Fluid Mechanics",
      "Machine Design",
      "Manufacturing Processes",
      "Heat Transfer",
      "Robotics",
    ],
    Civil: [
      "Structural Engineering",
      "Geotechnical Engineering",
      "Transportation Engineering",
      "Environmental Engineering",
      "Surveying",
      "Construction Management",
    ],
    Electrical: [
      "Electric Circuits",
      "Power Systems",
      "Control Systems",
      "Electrical Machines",
      "Power Electronics",
      "High Voltage Engineering",
    ],
    Chemical: [
      "Chemical Reaction Engineering",
      "Process Dynamics",
      "Thermodynamics",
      "Mass Transfer",
      "Heat Transfer",
      "Plant Design",
    ],
    Biotechnology: [
      "Biochemistry",
      "Microbiology",
      "Genetic Engineering",
      "Immunology",
      "Bioprocess Engineering",
      "Bioinformatics",
    ],
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState({
    id: "", // Paper ID from backend
    user_id: "",
    title: "",
    subject_name: "",
    department: "",
    topics: [],
    total_marks: 0,
    duration: "",
    include_formula: false,
    include_diagrams: false,
    include_answer_key: true,
    status: "draft",
    sections: [], // each section has its own questions[]
  });
  
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [availableTopics, setAvailableTopics] = useState([]);

  const handleSave = async () => {
    try {
      // Flatten updated questions from sections
      const updatedQuestions = generatedPaper.sections.flatMap(section =>
        section.questions.map(q => ({
          id: q.id,
          text: q.text,
          marks: q.marks,
          difficulty: q.difficulty,
          cognitive_level: q.cognitive_level,
          options: q.options,
          answer: q.answer,
          is_practical: q.is_practical,
          formula_required: q.formula_required,
          diagram: q.diagram,
          topic: q.topic,
          tags: q.tags,
        }))
      );
  
      // Call API to save questions
      const result = await questionService.updateQuestions(updatedQuestions);
  
      alert("Changes saved successfully!");
      console.log("Saved result:", result);
    } catch (error) {
      console.error("Error saving questions:", error);
      if (error.response) {
        console.error("Response:", error.response.data);
      }
      alert("Failed to save changes.");
    }
    
  };
  
  const handleDownloadPDF = async () => {
    try {
      const response = await questionService.downloadPaperPDF(generatedPaper.id);
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${generatedPaper.title || 'paper'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Error downloading PDF.');
    }
  };
  

  // Handle department change to update available topics
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setFormData({
      ...formData,
      department,
      topics: [],
    });
    setAvailableTopics(commonTopics[department] || []);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData({
      ...formData,
      year,
      topics: [],
    });
    setAvailableTopics(commonTopics[year] || []);
  };

  // Handle topic selection
  const handleTopicChange = (e) => {
    const topic = e.target.value;
    if (topic && !formData.topics.includes(topic) && topic !== "custom") {
      setFormData({
        ...formData,
        topics: [...formData.topics, topic],
      });
    } else if (topic === "custom") {
      // Do nothing, they'll use the custom topic input
    }
  };

  // Handle custom topic addition
  const handleAddCustomTopic = () => {
    if (
      formData.customTopic &&
      !formData.topics.includes(formData.customTopic)
    ) {
      setFormData({
        ...formData,
        topics: [...formData.topics, formData.customTopic],
        customTopic: "",
      });
    }
  };

  // Remove a topic
  const handleRemoveTopic = (topicToRemove) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((topic) => topic !== topicToRemove),
    });
  };

  // Handle question type toggle
  const handleQuestionTypeToggle = (type) => {
    const updatedQuestionTypes = {
      ...formData.questionTypes,
      [type]: !formData.questionTypes[type],
    };

    setFormData({
      ...formData,
      questionTypes: updatedQuestionTypes,
    });

    // Update sections based on enabled question types
    updateSectionsBasedOnQuestionTypes(updatedQuestionTypes);
  };

  // Update sections when question types change
  const updateSectionsBasedOnQuestionTypes = (questionTypes) => {
    const enabledTypes = Object.keys(questionTypes).filter(
      (type) => questionTypes[type]
    );
    if (enabledTypes.length === 0) return;

    // Create a new section for each enabled question type
    const newSections = enabledTypes.map((type, index) => {
      const typeName = {
        mcq: "Multiple Choice Questions",
        descriptive: "Short Answer Questions",
        programming: "Programming Questions",
        numerical: "Numerical Problems",
      }[type];

      const marksPerQuestion = {
        mcq: 2,
        descriptive: 5,
        programming: 10,
        numerical: 4,
      }[type];

      const numQuestions = {
        mcq: 10,
        descriptive: 5,
        programming: 3,
        numerical: 5,
      }[type];

      return {
        name: typeName,
        questionType: type,
        numQuestions: numQuestions,
        marksPerQuestion: marksPerQuestion,
      };
    });

    setFormData((prevData) => ({
      ...prevData,
      sections: newSections,
      numSections: newSections.length,
    }));

    // Recalculate total marks
    calculateTotalMarks(newSections);
  };

  // Handle slider changes
  const handleSliderChange = (category, subcategory, value) => {
    setSlidersTouched(true); // Mark that sliders have been touched

    // Calculate the adjustment needed for other values to maintain total of 100%
    const currentDistribution = formData[category];
    const currentTotal = Object.values(currentDistribution).reduce(
      (sum, val) => sum + val,
      0
    );
    const otherCategories = Object.keys(currentDistribution).filter(
      (key) => key !== subcategory
    );
    const otherTotal = currentTotal - currentDistribution[subcategory];
    const newValue = parseInt(value);

    // Calculate new values for other categories to maintain 100% total
    const adjustmentFactor = otherTotal > 0 ? (100 - newValue) / otherTotal : 0;
    const newDistribution = { ...currentDistribution };

    newDistribution[subcategory] = newValue;

    otherCategories.forEach((key) => {
      newDistribution[key] = Math.round(
        currentDistribution[key] * adjustmentFactor
      );
    });

    // Ensure the total is exactly 100%
    const newTotal = Object.values(newDistribution).reduce(
      (sum, val) => sum + val,
      0
    );
    if (newTotal !== 100) {
      const diff = 100 - newTotal;
      // Add the difference to the largest category other than the one being changed
      let largestCategory = otherCategories[0];
      otherCategories.forEach((key) => {
        if (newDistribution[key] > newDistribution[largestCategory]) {
          largestCategory = key;
        }
      });
      newDistribution[largestCategory] += diff;
    }

    setFormData({
      ...formData,
      [category]: newDistribution,
    });
  };

  // Calculate total marks based on sections
  const calculateTotalMarks = (sections) => {
    const totalMarks = sections.reduce((sum, section) => {
      return sum + section.numQuestions * section.marksPerQuestion;
    }, 0);

    setFormData((prevData) => ({
      ...prevData,
      totalMarks,
    }));

    return totalMarks;
  };

  // Handle section changes
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]:
        field === "numQuestions" || field === "marksPerQuestion"
          ? parseInt(value)
          : value,
    };

    // Recalculate total marks
    const totalMarks = calculateTotalMarks(updatedSections);

    setFormData({
      ...formData,
      sections: updatedSections,
      totalMarks,
    });
  };

  // Add a new section
  const handleAddSection = () => {
    if (formData.sections.length < 5) {
      // Limit to 5 sections
      const newSection = {
        name: `Section ${String.fromCharCode(65 + formData.sections.length)}`,
        questionType: "descriptive",
        numQuestions: 3,
        marksPerQuestion: 5,
      };

      const updatedSections = [...formData.sections, newSection];

      setFormData({
        ...formData,
        sections: updatedSections,
        numSections: formData.numSections + 1,
      });

      // Recalculate total marks
      calculateTotalMarks(updatedSections);
    }
  };

  // Remove a section
  const handleRemoveSection = (index) => {
    if (formData.sections.length > 1) {
      // Keep at least one section
      const updatedSections = formData.sections.filter((_, i) => i !== index);

      // Rename sections to maintain alphabetical order
      const renamedSections = updatedSections.map((section, i) => ({
        ...section,
        name: `Section ${String.fromCharCode(65 + i)}`,
      }));

      setFormData({
        ...formData,
        sections: renamedSections,
        numSections: formData.numSections - 1,
      });

      // Recalculate total marks
      calculateTotalMarks(renamedSections);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Utility function to get a random category based on weights
  const getRandomWeightedCategory = (distribution) => {
    const categories = Object.keys(distribution);
    const weights = Object.values(distribution);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < categories.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        return categories[i];
      }
    }
    return categories[0]; // fallback
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.subjectName) {
      setError("Subject name is required");
      return;
    }

    if (!formData.department) {
      setError("Department is required");
      return;
    }

    if (formData.topics.length === 0) {
      setError("At least one topic is required");
      return;
    }

    if (!Object.values(formData.questionTypes).some((type) => type)) {
      setError("At least one question type must be selected");
      return;
    }

    try {
      setIsGenerating(true);

      // Format data according to the EXACT required structure for the backend
      const paperParams = {
        subjectName: formData.subjectName,
        department: formData.department,
        topics: formData.topics,
        sections: formData.sections.map((section) => ({
          name: section.name,
          numQuestions: section.numQuestions,
          questionType: section.questionType,
          marksPerQuestion: section.marksPerQuestion,
        })),
        difficultyDistribution: formData.difficultyDistribution,
        cognitiveDistribution: formData.cognitiveDistribution,
        practicalTheoretical: formData.practicalTheoretical,
      };

      // Optional parameters to include if they're present in formData
      if (formData.totalMarks) paperParams.totalMarks = formData.totalMarks;
      if (formData.duration) paperParams.duration = formData.duration;
      if (formData.includeFormula !== undefined)
        paperParams.includeFormula = formData.includeFormula;
      if (formData.includeDiagrams !== undefined)
        paperParams.includeDiagrams = formData.includeDiagrams;
      if (formData.includeAnswerKey !== undefined)
        paperParams.includeAnswerKey = formData.includeAnswerKey;

      // Print the data before sending it to backend
      console.log(
        "Paper parameters to be sent to backend:",
        JSON.stringify(paperParams, null, 2)
      );

      // In production, make the actual API call
      const response = await questionService.generatePaper(paperParams);
      console.log("Response from backend:", response.data);
      setGeneratedPaper(response.data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response data
      const mockQuestions = [];
      let questionId = 1;

      // Generate mock questions for each section
      formData.sections.forEach((section) => {
        const sectionQuestions = Array(section.numQuestions)
          .fill()
          .map((_, i) => {
            const difficulty = getRandomWeightedCategory(
              formData.difficultyDistribution
            );
            const cognitiveLevel = getRandomWeightedCategory(
              formData.cognitiveDistribution
            );
            const questionType = section.questionType;
            const isPractical =
              Math.random() * 100 < formData.practicalTheoretical.practical;

            return {
              id: questionId++,
              sectionName: section.name,
              text: `${
                isPractical ? "Practical" : "Theoretical"
              } ${questionType} question on ${
                formData.topics[
                  Math.floor(Math.random() * formData.topics.length)
                ]
              } (${difficulty} difficulty, tests ${cognitiveLevel})`,
              questionType,
              difficulty,
              cognitiveLevel,
              marks: section.marksPerQuestion,
              options:
                questionType === "mcq"
                  ? ["Option A", "Option B", "Option C", "Option D"]
                  : null,
              answer:
                questionType === "mcq"
                  ? "A"
                  : "Sample answer for this question",
              isPractical,
            };
          });

        mockQuestions.push(...sectionQuestions);
      });

      const mockPaper = {
        id: Date.now(),
        title: `${formData.subjectName} Exam Paper`,
        subjectName: formData.subjectName,
        department: formData.department,
        topics: formData.topics,
        sections: formData.sections,
        totalMarks: formData.totalMarks,
        duration: formData.duration,
        questions: mockQuestions,
        includeFormula: formData.includeFormula,
        includeDiagrams: formData.includeDiagrams,
        includeAnswerKey: formData.includeAnswerKey,
        createdAt: new Date().toISOString(),
      };

      // setGeneratedPaper(mockPaper);

      // Store in localStorage for archives
      const savedPapers =
        JSON.parse(localStorage.getItem("generatedPapers")) || [];
      const newPaperForArchive = {
        id: mockPaper.id,
        title: mockPaper.title,
        subjectName: mockPaper.subjectName,
        department: mockPaper.department,
        topics: mockPaper.topics,
        totalMarks: mockPaper.totalMarks,
        duration: mockPaper.duration,
        questionCount: mockPaper.questions.length,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "generatedPapers",
        JSON.stringify([newPaperForArchive, ...savedPapers])
      );

      // Add to global state
      dispatch({ type: "ADD_PAPER", payload: mockPaper });
    } catch (error) {
      console.error("Error generating paper:", error);
      setError("Failed to generate paper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  // // Helper function to get a random category based on weighted distribution
  // const getRandomWeightedCategory = (distribution) => {
  //   const rand = Math.random() * 100;
  //   let cumulativeWeight = 0;

  //   for (const [category, weight] of Object.entries(distribution)) {
  //     cumulativeWeight += weight;
  //     if (rand <= cumulativeWeight) {
  //       return category;
  //     }
  //   }

  //   // Default fallback
  //   return Object.keys(distribution)[0];
  // };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="genhead">
          <h1>Generate Question Paper</h1>
        </div>

        <div className="generate-paper-container">
          {!generatedPaper ? (
            <div className="paper-form-wrapper">
              <div className="form-tabs">
                <button
                  className={`tab-button ${
                    activeTab === "basic" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("basic")}
                >
                  Basic Info
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "content" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Content
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "structure" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("structure")}
                >
                  Structure
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "advanced" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("advanced")}
                >
                  Advanced
                </button>
              </div>

              <form onSubmit={handleSubmit} className="generate-paper-form">
                {/* Basic Info Tab */}
                <div
                  className={`form-tab-content ${
                    activeTab === "basic" ? "active" : ""
                  }`}
                >
                  <h2>Subject Information</h2>

                  <div className="form-group">
                    <label htmlFor="subjectName">Subject Name:</label>
                    <input
                      type="text"
                      id="subjectName"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleChange}
                      placeholder="e.g. Data Structures, Thermodynamics"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department/Branch:</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleDepartmentChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Year:</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleYearChange}
                    >
                      <option value="">Select year</option>
                      {year.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Exam Duration (minutes):</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="15"
                      max="240"
                    />
                  </div>

                  <div className="form-group">
                    <p>Total Marks: {formData.totalMarks}</p>
                  </div>
                </div>

                {/* Content Tab */}
                <div
                  className={`form-tab-content ${
                    activeTab === "content" ? "active" : ""
                  }`}
                >
                  <h2>Topic Coverage</h2>

                  <div className="form-group">
                    <label htmlFor="topicSelect">Select Topics:</label>
                    <div className="topic-selection">
                      <select
                        id="topicSelect"
                        onChange={handleTopicChange}
                        value=""
                      >
                        <option value="">Select a topic</option>
                        {availableTopics.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                        <option value="custom">Add Custom Topic</option>
                      </select>

                      {formData.topics.length > 0 && (
                        <div className="selected-topics">
                          <h4>Selected Topics:</h4>
                          <ul>
                            {formData.topics.map((topic) => (
                              <li key={topic}>
                                {topic}
                                <button
                                  type="button"
                                  className="remove-topic"
                                  onClick={() => handleRemoveTopic(topic)}
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="custom-topic-input">
                        <input
                          type="text"
                          placeholder="Enter custom topic"
                          value={formData.customTopic}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customTopic: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomTopic}
                          disabled={!formData.customTopic}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structure Tab */}
                <div
                  className={`form-tab-content ${
                    activeTab === "structure" ? "active" : ""
                  }`}
                >
                  <h2>Exam Structure</h2>

                  <div className="sections-container">
                    {formData.sections.map((section, index) => (
                      <div key={index} className="section-item">
                        <div className="section-header">
                          <h3>{section.name}</h3>
                          <button
                            type="button"
                            className="remove-section"
                            onClick={() => handleRemoveSection(index)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="section-content">
                          <div className="form-group">
                            <label>Question Type:</label>
                            <select
                              value={section.questionType}
                              onChange={(e) =>
                                handleSectionChange(
                                  index,
                                  "questionType",
                                  e.target.value
                                )
                              }
                            >
                              <option value="mcq">Multiple Choice</option>
                              <option value="numerical">Numerical</option>
                              <option value="descriptive">Descriptive</option>
                              <option value="programming">Programming</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Number of Questions:</label>
                            <input
                              type="number"
                              value={section.numQuestions}
                              onChange={(e) =>
                                handleSectionChange(
                                  index,
                                  "numQuestions",
                                  e.target.value
                                )
                              }
                              min="1"
                              max="50"
                            />
                          </div>

                          <div className="form-group">
                            <label>Marks per Question:</label>
                            <input
                              type="number"
                              value={section.marksPerQuestion}
                              onChange={(e) =>
                                handleSectionChange(
                                  index,
                                  "marksPerQuestion",
                                  e.target.value
                                )
                              }
                              min="1"
                              max="20"
                            />
                          </div>

                          <div className="section-summary">
                            <p>Total Questions: {section.numQuestions}</p>
                            <p>
                              Total Marks:{" "}
                              {section.numQuestions * section.marksPerQuestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="add-section-btn"
                      onClick={handleAddSection}
                      disabled={formData.sections.length >= 5}
                    >
                      Add Section
                    </button>
                  </div>
                </div>

                {/* Advanced Tab */}
                <div
                  className={`form-tab-content ${
                    activeTab === "advanced" ? "active" : ""
                  }`}
                >
                  <h2>Difficulty Distribution</h2>
                  <div className="distribution-sliders">
                    <div className="slider-group">
                      <label>
                        Easy: {formData.difficultyDistribution.easy}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.difficultyDistribution.easy}
                          onChange={(e) =>
                            handleSliderChange(
                              "difficultyDistribution",
                              "easy",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Medium: {formData.difficultyDistribution.medium}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.difficultyDistribution.medium}
                          onChange={(e) =>
                            handleSliderChange(
                              "difficultyDistribution",
                              "medium",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Hard: {formData.difficultyDistribution.hard}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.difficultyDistribution.hard}
                          onChange={(e) =>
                            handleSliderChange(
                              "difficultyDistribution",
                              "hard",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <h2>Cognitive Level Distribution</h2>
                  <div className="distribution-sliders">
                    <div className="slider-group">
                      <label>
                        Remember/Knowledge:{" "}
                        {formData.cognitiveDistribution.remember}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.cognitiveDistribution.remember}
                          onChange={(e) =>
                            handleSliderChange(
                              "cognitiveDistribution",
                              "remember",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Understand/Comprehension:{" "}
                        {formData.cognitiveDistribution.understand}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.cognitiveDistribution.understand}
                          onChange={(e) =>
                            handleSliderChange(
                              "cognitiveDistribution",
                              "understand",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Apply: {formData.cognitiveDistribution.apply}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.cognitiveDistribution.apply}
                          onChange={(e) =>
                            handleSliderChange(
                              "cognitiveDistribution",
                              "apply",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Analyze: {formData.cognitiveDistribution.analyze}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.cognitiveDistribution.analyze}
                          onChange={(e) =>
                            handleSliderChange(
                              "cognitiveDistribution",
                              "analyze",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <h2>Practical vs Theoretical Balance</h2>
                  <div className="distribution-sliders">
                    <div className="slider-group">
                      <label>
                        Theoretical: {formData.practicalTheoretical.theoretical}
                        %
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.practicalTheoretical.theoretical}
                          onChange={(e) =>
                            handleSliderChange(
                              "practicalTheoretical",
                              "theoretical",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="slider-group">
                      <label>
                        Practical: {formData.practicalTheoretical.practical}%
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.practicalTheoretical.practical}
                          onChange={(e) =>
                            handleSliderChange(
                              "practicalTheoretical",
                              "practical",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <h2>Additional Options</h2>
                  <div className="form-group additional-options">
                    <label>
                      <input
                        type="checkbox"
                        name="includeFormula"
                        checked={formData.includeFormula}
                        onChange={handleChange}
                      />
                      Include Formula Sheet
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="includeDiagrams"
                        checked={formData.includeDiagrams}
                        onChange={handleChange}
                      />
                      Include Diagrams (where applicable)
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="includeAnswerKey"
                        checked={formData.includeAnswerKey}
                        onChange={handleChange}
                      />
                      Include Answer Key
                    </label>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      className="prev-button"
                      onClick={() => {
                        const tabs = [
                          "basic",
                          "content",
                          "structure",
                          "advanced",
                        ];
                        const currentIndex = tabs.indexOf(activeTab);
                        setActiveTab(tabs[currentIndex - 1]);
                      }}
                    >
                      Previous
                    </button>
                  )}

                  {activeTab !== "advanced" ? (
                    <button
                      type="button"
                      className="next-button"
                      onClick={() => {
                        const tabs = [
                          "basic",
                          "content",
                          "structure",
                          "advanced",
                        ];
                        const currentIndex = tabs.indexOf(activeTab);
                        setActiveTab(tabs[currentIndex + 1]);
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="generate-button"
                      disabled={!slidersTouched || isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate Paper"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="paper-preview">
              <h2>{generatedPaper.title}</h2>

              <div className="paper-metadata">
                <div className="metadata-item">
                  <strong>Subject:</strong> {generatedPaper.subject_name}
                </div>
                <div className="metadata-item">
                  <strong>Department:</strong> {generatedPaper.department}
                </div>
                <div className="metadata-item">
                  <strong>Total Marks:</strong> {generatedPaper.total_marks}
                </div>
                <div className="metadata-item">
                  <strong>Duration:</strong> {generatedPaper.duration} minutes
                </div>
              </div>

              <div className="paper-topics">
                <strong>Topics:</strong>{" "}
                {Array.isArray(generatedPaper?.topics)
                  ? generatedPaper.topics.join(", ")
                  : "Not Available"}
              </div>

              {generatedPaper.include_formula && (
                <div className="formula-sheet">
                  <h3>Formula Sheet</h3>
                  <p>
                    This is a placeholder for the formula sheet that would be
                    generated for this exam.
                  </p>
                </div>
              )}

              <div className="paper-sections">
                {Array.isArray(generatedPaper?.sections) &&
                generatedPaper.sections.length > 0 ? (
                  generatedPaper.sections.map((section, sectionIndex) => {
                    const sectionQuestions = section.questions || [];

                    return (
                      <div key={sectionIndex} className="paper-section">
                        <h3>
                          {section.name} (
                          {section.question_type === "mcq"
                            ? "Multiple Choice"
                            : section.question_type === "numerical"
                            ? "Numerical"
                            : section.question_type === "programming"
                            ? "Programming"
                            : "Descriptive"}
                          )
                        </h3>

                        <div className="section-questions">
                          {sectionQuestions.map((question, questionIndex) => {
                            const questionId = `question-${section.id}-${questionIndex}`;

                            return (
                              <div
                                key={questionIndex}
                                className="question-item"
                              >
                                <div className="question-header">
                                  <h4>
                                    Question {questionIndex + 1}{" "}
                                    <span className="marks">
                                      ({question.marks} marks)
                                    </span>
                                  </h4>
                                  <div className="question-tags">
                                    <span
                                      className={`difficulty-tag ${question.difficulty}`}
                                    >
                                      {question.difficulty
                                        .charAt(0)
                                        .toUpperCase() +
                                        question.difficulty.slice(1)}
                                    </span>
                                    <span className="cognitive-tag">
                                      {question.cognitive_level
                                        .charAt(0)
                                        .toUpperCase() +
                                        question.cognitive_level.slice(1)}
                                    </span>
                                    <span
                                      className={`type-tag ${
                                        question.is_practical
                                          ? "practical"
                                          : "theoretical"
                                      }`}
                                    >
                                      {question.is_practical
                                        ? "Practical"
                                        : "Theoretical"}
                                    </span>
                                  </div>
                                </div>

                                {/* Editable question text area */}
                                <div className="question-text-container">
                                  <textarea
                                    id={questionId}
                                    className="question-text-editor w-full p-2 border rounded min-h-24"
                                    value={question.text}
                                    onChange={(e) => {
                                      const newText = e.target.value;
                                    
                                      // Deep copy of sections
                                      const updatedSections = [...generatedPaper.sections];
                                      const updatedSection = { ...updatedSections[sectionIndex] };
                                      const updatedQuestions = [...updatedSection.questions];
                                    
                                      // Update just this question
                                      updatedQuestions[questionIndex] = {
                                        ...updatedQuestions[questionIndex],
                                        text: newText,
                                      };
                                    
                                      // Put updated questions back into the section
                                      updatedSection.questions = updatedQuestions;
                                      updatedSections[sectionIndex] = updatedSection;
                                    
                                      // Set full updated paper
                                      setGeneratedPaper({
                                        ...generatedPaper,
                                        sections: updatedSections,
                                      });
                                    }}
                                    
                                  />
                                </div>

                                {question.question_type === "mcq" &&
                                  question.options && (
                                    <div className="question-options mt-2">
                                      {question.options.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="option"
                                          >
                                            <span className="option-letter">
                                              {String.fromCharCode(
                                                65 + optionIndex
                                              )}
                                              .
                                            </span>{" "}
                                            {option}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}

                                {generatedPaper.include_answer_key && (
                                  <div className="question-answer mt-2">
                                    <strong>Answer:</strong> {question.answer}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No sections available.</div>
                )}
              </div>

              <div className="paper-actions mt-4">
                <button
                  className="generate-button mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setGeneratedPaper(null)}
                >
                  Generate Another Paper
                </button>
                <button
                  className="download-button mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </button>
                <button
                  className="save-button px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePaper;
