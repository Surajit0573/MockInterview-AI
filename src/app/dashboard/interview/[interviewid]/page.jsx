"use client";

import { LightbulbIcon, LucideWebcam } from "lucide-react";
import Webcam from "react-webcam";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function Interview() {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webcamenabled, setwebcamenabled] = useState(false);


  const { interviewid } = useParams();
  console.log('interviewid:', interviewid);



  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(`/api/mock/${interviewid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interview details");
        }
        const data = await response.json();
        console.log("data", data);
        setInterviewData(data);
        console.log('interviewData',interviewData);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch interview details only if interviewid is defined
    if (interviewid) {
      getDetails();
    }
  }, [interviewid]);

  // Handle loading state
  if (loading) return <div>Loading...</div>;

  // Handle error state
  if (error) return <div>Error: {error}</div>;

  // Render the interview details once fetched
  return (
    <div className="p-10 mt-0 rounded-lg shadow-lg">
      {/* Heading Section */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
        Let's Get Started
      </h1>
      

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center w-full">
        {/* Interview Details Section */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-600 mb-12">
        Interview Details
      </h2>
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="text-gray-800">Job Role/Position:</strong> {interviewData?.jobPosition}
            </p>
            <p className="text-lg">
              <strong className="text-gray-800">Job Description:</strong> {interviewData?.jobDesc}
            </p>
            <p className="text-lg">
              <strong className="text-gray-800">Years of Experience:</strong> {interviewData?.jobexperience}
            </p>
          </div>
          <div className="mt-3 my-4 bg-yellow-200 border-yellow-300 p-4 shadow-lg rounded-lg">
            <h2 className="flex items-center">
              <LightbulbIcon />
              <strong className="ml-2">Information</strong>
            </h2>
            <p>
              Enable the webcam and microphone to start your AI Mock Interview.
              You will have 5 questions, and at the end, you'll receive a detailed report based on your answers. 
              <br />
              <strong>Note:</strong> We do not record your video, and you can disable the webcam at any time.
            </p>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-200 p-8 rounded-lg shadow-md border border-gray-300">
          {webcamenabled ? (
            <Webcam
              onUserMedia={() => setwebcamenabled(true)}
              onUserMediaError={() => setwebcamenabled(false)}
              mirrored={true}
              className="rounded-lg shadow-lg border border-gray-300"
              style={{ width: 320, height: 240 }}
            />
          ) : (
            <>
              <div className="flex flex-col items-center justify-center h-80 w-80 bg-gray-300 rounded-lg border border-dashed border-gray-400 p-8">
                <LucideWebcam className="h-24 w-24 text-gray-500" />
                <p className="text-gray-700 mt-4">Web Camera Disabled</p>
              </div>
              <button
                onClick={() => setwebcamenabled(true)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-200"
              >
                Enable Web Camera and Microphone
              </button>
            </>
          )}
          
        </div>
       
      </div>
      <div className="flex items-center justify-center mt-5 my-3">
  <button className="bg-violet-500 text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 shadow-lg border border-violet-700 hover:bg-violet-600 hover:shadow-xl transition duration-300 ease-in-out transformfocus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
    Start Interview
  </button>
</div>

    </div>
  );
}

export default Interview;
