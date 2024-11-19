'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import InterviewQuestions from './_components/Questions';
import RecordAnswerSection from './_components/RecordAnswerSection'

function StartInterview() {
  const [interviewData, setInterviewData] = useState();
  const [loading, setLoading] = useState(true);
  const [mockInterviewQuestion, setmockInterviewQuestion] = useState([]);
  const [error, setError] = useState();
  const { interviewid } = useParams();
  const[activeQuestionIndex,setActiveQuestionIndex]=useState(0);
  
  console.log('interviewid:', interviewid);
  
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(`/api/mock/${interviewid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interview details");
        }
        const data = await response.json();
        console.log("data:", data);
        setInterviewData(data);
        
        // Ensure MockResponse is an array
        const parsedQuestions = data.MockResponse || [];
        setmockInterviewQuestion(parsedQuestions);
        console.log('mockInterviewQuestion:', parsedQuestions);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (interviewid) {
      getDetails();
    }
  }, [interviewid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <InterviewQuestions
       mockInterviewQuestion={mockInterviewQuestion}
       activeQuestionIndex={activeQuestionIndex} />
       <div>
        <RecordAnswerSection
         mockInterviewQuestion={mockInterviewQuestion}
         activeQuestionIndex={activeQuestionIndex}
         interviewid={interviewid} />
       </div>
    </div>
  );
}

export default StartInterview;
