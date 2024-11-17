import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';

function RecordAnswerSection() {
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
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        {isRecording ? (
          <>
            <MicOff className='animate-pulse' />
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
