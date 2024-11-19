import { Button } from '@/components/ui/button';
import { Mic, MicOff, PauseCircleIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from "sonner"
import { chatSession } from '@/lib/AI/GeminiAIModel';


function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewid}) {
  const [userAnswer, setUserAnswer] = useState('');


  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results) {
      results.map((result) => {
        setUserAnswer((prevAns) => prevAns + result?.transcript);
      });
    }
  }, [results]);

  const recordUserAnswer=async()=>{
    if(isRecording){
      stopSpeechToText();
      if(userAnswer?.length<10){
        toast('Error while saving your answer,Please record it again');
        return;
      }
      const feedbackPrompt=`Question:${mockInterviewQuestion[activeQuestionIndex]?.question},User Answer:${userAnswer},
      Depending on question and user answer for given interview question,please 
      give us rating for answer and feedback as area of improvement
      if any in just 4-5 lines to improve it in JSON format
      with rating field and feedback field`;
      const result=await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp=(result.response.text());
      const cleanedResponse=mockJsonResp.replace(/```json/g, "").replace(/```/g, "").trim();
      console.log('cleanedResponse',cleanedResponse);
      if(cleanedResponse){
        const mockUserAns={
          mockInterviewId:interviewid,
          question:mockInterviewQuestion[activeQuestionIndex]?.question,
          userAnswer:userAnswer,
          feedback:JSON.parse(cleanedResponse),

        }
        console.log(mockUserAns);
        const response = await fetch(`/api/mock/${interviewid}/ans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockUserAns),
        });
        
        if (!response.ok) {
          toast('Error while saving your answer, please try again.');
          return;
        }
        const data = await response.json();
        toast(data.message || 'Answer saved successfully!');
  
      }

    }else{
      startSpeechToText();
    }
  }

  if (error) return <p className='text-center text-red-500'>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className='flex flex-col items-center justify-center space-y-6'>
      {/* Webcam Section */}
      <div className='mt-7 my-7 relative flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden shadow-lg'>
        <Image
          src='/webcam1.png'
          alt='webcam background'
          width={200}
          height={100}
          className='absolute z-0 opacity-50'
        />
        <Webcam
          mirrored={true}
          className='relative z-10 rounded-lg'
          style={{ width: '100%', height: 300 }}
        />
      </div>

      {/* Recording Button */}
      <Button
        className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-all duration-300 rounded-full shadow-md
          ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}
        onClick={recordUserAnswer}
      >
        {isRecording ? (
          <>
            <PauseCircleIcon className='animate-pulse' />
            Stop Recording
          </>
        ) : (
          <>
            <Mic />
            Start Recording
          </>
        )}
      </Button>

      {/* Display User's Answer Button */}
      <Button
        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300'
        onClick={() => console.log(userAnswer)}
      >
        Show User Answer
      </Button>

      {/* Display the Transcribed Answer */}
      {userAnswer && (
        <div className='mt-8 p-4 w-full max-w-2xl bg-gray-100 border border-gray-300 rounded-lg shadow-inner'>
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>Your Recorded Answer:</h2>
          <p className='text-gray-700 whitespace-pre-wrap'>{userAnswer}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;
