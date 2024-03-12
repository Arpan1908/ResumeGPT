import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "./Firebase";
import { initFirebase } from "./Firebase";
import jsPDF from 'jspdf';
import { getAuth } from "firebase/auth";

import { Button, Input } from "@chakra-ui/react";

const API_KEY = "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";

const systemMessage = {
  role: "system",
  content:
    "Generate a big resume from the entered data according to their experience and education  in details. Give in a resume format.Generate in such a way the whole document can be fitted in a single pdf",
};

function Resume() {
  const app = initFirebase();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  

  const [resumeContent, setResumeContent] = useState('');

  // Function to handle PDF download
  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(10.5); 
    pdf.text(resume, 10, 10);
    pdf.save('generated_resume.pdf');
  };

  // Replace this function with your method to get the generated resume content
  const fetchResumeContent = () => {
    // Assume you fetch the resume content from an API or generate it dynamically
    const generatedResumeContent = `Put your generated resume content here`;
    setResumeContent(generatedResumeContent);
  };

  // Fetch resume content when component mounts
  useEffect(() => {
    fetchResumeContent();
  }, []);

  useEffect(() => {
    // Check if user is signed in
    if (!auth.currentUser) {
      navigate("/register"); // Redirect to sign-in page if not signed in
    }
  }, [auth.currentUser, navigate]);

  useEffect(() => {
    const fetchEmail = async () => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email);
      } else {
        // Redirect to sign-in page if user is not logged in
        navigate("/register");
      }
    };
    fetchEmail();
  }, [auth.currentUser, navigate]);

  const [messages, setMessages] = useState([
    {
      message:
        "Hello, I'm ChatGPT! Please provide your details to generate a resume.",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);

  const [resume, setResume] = useState("");
  const [internships, setInternships] = useState([
    { company: "", duration: "", description: "" },
  ]);

  // Function to handle form submission and generating the resume
  const handleSend = async (formData) => {
    const newMessage = {
      message: JSON.stringify(formData), // Assuming formData is an object
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    await processMessageToChatGPT(newMessages);
  };

  // Function to handle adding a new internship field
  const addInternshipField = () => {
    setInternships([
      ...internships,
      { company: "", duration: "", description: "" },
    ]);
  };

  // Function to handle updating internship data
  const handleInternshipChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInternships = [...internships];
    updatedInternships[index][name] = value;
    setInternships(updatedInternships);
  };

  // Function to handle removing an internship field
  const removeInternshipField = (index) => {
    const updatedInternships = [...internships];
    updatedInternships.splice(index, 1);
    setInternships(updatedInternships);
  };

  // Function to process messages to ChatGPT
  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setResume(data.choices[0].message.content); // Update resume state with generated content
      });
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 flex-col">
        <div className="">
          <div className="rounded-lg shadow-md p-6">
            <h2>Enter Your Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {};
                formData.forEach((value, key) => {
                  data[key] = value;
                });
                handleSend(data);
                e.target.reset();
              }}
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                height: "auto",
                display: "block",
                marginTop: "100px",
                backgroundColor: "#f5f5f5",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Profile
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        About
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="about"
                          name="about"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Write a few sentences about yourself.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                      </label>
                      <div className="mt-2">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="region"
                          id="region"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Skills
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    autoComplete="postal-code"
                    placeholder="add skills"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div style={{ marginTop: "20px" }}>
                  <h3>Internships</h3>
                  {internships.map((internship, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "block",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        type="text"
                        name="company"
                        value={internship.company}
                        onChange={(e) => handleInternshipChange(index, e)}
                        placeholder="Company"
                        style={{
                          marginRight: "10px",
                          width: "250px",
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <Input
                        type="text"
                        name="duration"
                        value={internship.duration}
                        onChange={(e) => handleInternshipChange(index, e)}
                        placeholder="Duration"
                        style={{
                          marginRight: "10px",
                          width: "250px",
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <div>
                        <Input
                          type="text"
                          name="description"
                          value={internship.description}
                          onChange={(e) => handleInternshipChange(index, e)}
                          placeholder="Description"
                          style={{
                            marginRight: "10px",
                            width: "250px",
                            marginTop: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => removeInternshipField(index)}
                        colorScheme="red"
                        size="md"
                        variant="solid"
                        style={{ marginTop: "8px" }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={addInternshipField}
                    colorScheme="blue"
                    size="md"
                    variant="solid"
                  >
                    Add Internship
                  </Button>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Generated Resume</h2>
          <div className="border border-gray-300 p-4 h-60 overflow-y-auto">
            <pre>{resume}</pre>
            
          </div>
        </div>
        <div>
        <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}

export default Resume;
