// pages/profile.js
'use client'
import { useState, useCallback, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Mail, Linkedin, MessageSquare, Info, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Experience from '../_components/Experience';

export default function ProfilePage() {
  // Tech tags for skills selection
  const techtags = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C#", label: "C#" },
    { value: "Ruby", label: "Ruby" },
    { value: "PHP", label: "PHP" },
    { value: "Go", label: "Go" },
    { value: "Rust", label: "Rust" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "SQL", label: "SQL" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "Flutter", label: "Flutter" },
  ];

  // State for skills section
  const [searchTerm, setSearchTerm] = useState('');
  const skillColors = [
    "bg-blue-600", "bg-purple-600", "bg-green-600", "bg-red-600", 
    "bg-yellow-600", "bg-indigo-600", "bg-pink-600", "bg-teal-600"
  ];

  // State for file upload
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: SetStateAction<never[]>) => {
    // Update the state with the accepted files
    setUploadedFiles(acceptedFiles);
  }, []);
  
  // Initialize dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
  });

  // Initialize react-hook-form
  const form = useForm({
    defaultValues: {
      Name: 'Jarvis',
      dob: '1996-09-12',
      gender: 'male',
      email: 'iamthejarvis@gmail.com',
      linkedin: '/in/jarvis-23553141/',
      github: 'qwe.ui1qQ3d345',
      interview: 'no',
      description: 'Write a short Introduction about yourself',
      skills: []
    }
  });

  // Destructure form methods
  const { register, handleSubmit, watch, formState: { errors }, control, setValue } = form;
  const watchedSkills = watch('skills') || [];

  const [completionPercentage, setCompletionPercentage] = useState(10);
  const [activeTab, setActiveTab] = useState('personal');

  // Filter tags based on search term
  const filteredTags = techtags.filter(tag => 
    tag.label.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !watchedSkills.includes(tag.value)
  );

  // Handle adding a skill
  const handleSkillAdd = (skill: string) => {
    if (!watchedSkills.includes(skill)) {
      setValue('skills', [...watchedSkills, skill]);
      setSearchTerm('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove: never) => {
    setValue('skills', watchedSkills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = (data: any) => {
    console.log(data);
    console.log('Uploaded file:', uploadedFiles);
    // Handle form submission
    setCompletionPercentage(prev => Math.min(prev + 10, 100));
  };

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'skills', label: 'Skills' },
    { id: 'exp', label: 'experience' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Complete your profile details</h1>
        <p className="text-gray-400 text-sm mb-6">Detail Your Talent: Complete profile is your canvas to success</p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 relative ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeTab==='exp' && (
                <Experience/>

              )}
              {/* Personal Details Section */}
              {activeTab === 'personal' && (
                <>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="Name" className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                          id="Name"
                          type="text"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white"
                          {...register('Name', { required: true })}
                        />
                        {errors.Name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
                      </div>
                      
                      {/* Date of Birth */}
                      <div className="relative">
                        <label htmlFor="dob" className="block text-sm text-gray-400 mb-1">Date of birth</label>
                        <div className="relative">
                          <input
                            id="dob"
                            type="date"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white pr-10"
                            {...register('dob', { required: true })}
                          />
                          <Calendar className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                          {errors.dob && <p className="text-red-500 text-sm mt-1">Date of birth is required</p>}
                        </div>
                      </div>
                      
                      {/* Gender */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Gender</label>
                        <div className="flex items-center space-x-6 bg-gray-700 border border-gray-600 rounded-md p-2.5">
                          <div className="flex items-center">
                            <input
                              id="male"
                              type="radio"
                              value="male"
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-gray-600 border-gray-500"
                              {...register('gender')}
                            />
                            <label htmlFor="male" className="ml-2 text-sm text-gray-300">Male</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="female"
                              type="radio"
                              value="female"
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-gray-600 border-gray-500"
                              {...register('gender')}
                            />
                            <label htmlFor="female" className="ml-2 text-sm text-gray-300">Female</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div className="relative">
                        <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white pr-10"
                            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                          />
                          <Mail className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                          {errors.email && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
                        </div>
                      </div>
                      
                      {/* LinkedIn */}
                      <div className="relative">
                        <label htmlFor="linkedin" className="block text-sm text-gray-400 mb-1">LinkedIn</label>
                        <div className="relative">
                          <input
                            id="linkedin"
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white pr-10"
                            {...register('linkedin')}
                          />
                          <Linkedin className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                        </div>
                      </div>
                      
                      {/* GitHub */}
                      <div className="relative">
                        <label htmlFor="github" className="block text-sm text-gray-400 mb-1">GitHub</label>
                        <div className="relative">
                          <input
                            id="github"
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white pr-10"
                            {...register('github')}
                          />
                          <MessageSquare className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="description" className="block text-sm text-gray-400 mb-1">Description</label>
                      </div>
                    </div>
                    <div className="relative mt-4">
                      <textarea
                        id="description"
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white pr-10 resize-none"
                        placeholder="Enter your description..."
                        {...register('description', { required: true })}
                      ></textarea>
                      <MessageSquare className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                      {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                    </div>
                  </div>
                  
                  {/* Availability Section */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Availability Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Are you a Interviewer or Interviewee?</label>
                        <div className="flex items-center space-x-6 bg-gray-700 border border-gray-600 rounded-md p-2.5">
                          <div className="flex items-center">
                            <input
                              id="yes"
                              type="radio"
                              value="yes"
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-gray-600 border-gray-500"
                              {...register('interview')}
                            />
                            <label htmlFor="yes" className="ml-2 text-sm text-gray-300">Yes</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="no"
                              type="radio"
                              value="no"
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-gray-600 border-gray-500"
                              {...register('interview')}
                            />
                            <label htmlFor="no" className="ml-2 text-sm text-gray-300">No</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Resume Upload Section */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-1">Upload Resume</h2>
                    <p className="text-gray-400 text-sm mb-4">Boost Your Score by Engage and excel! every action enhances your profile</p>
                    <div 
                      {...getRootProps()} 
                      className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-md bg-gray-700 p-6 cursor-pointer ${
                        isDragActive ? 'border-purple-500 bg-gray-600' : ''
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploadedFiles.length > 0 ? (
                        <div className="w-full">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-600 p-2 rounded mt-2">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <button 
                                type="button" 
                                className="text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadedFiles([]);
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          {isDragActive ? (
                            <p className="text-gray-300">Drop the resume here...</p>
                          ) : (
                            <div className="text-center">
                              <p className="text-gray-300">Drag and drop your resume here, or click to select</p>
                              <p className="text-gray-400 text-xs mt-1">Supports PDF, DOC, DOCX (Max 5MB)</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* Skills Section */}
              {activeTab === 'skills' && (
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transform transition-all hover:shadow-blue-900/20 hover:shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400">Technical Skills</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">Add Skills</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search skills..."
                          className="w-full bg-gray-700 border border-gray-600 text-white p-3 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {searchTerm && (
                      <div className="bg-gray-700 rounded-md p-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                        {filteredTags.length > 0 ? (
                          filteredTags.map((tag) => (
                            <button
                              key={tag.value}
                              type="button"
                              onClick={() => handleSkillAdd(tag.value)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-600 rounded-md transition-colors text-gray-200"
                            >
                              {tag.label}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-400 p-2">No matching skills found</p>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label className="text-gray-300 font-medium block mb-2">Selected Skills</label>
                      
                      <div className="bg-gray-700 border border-gray-600 rounded-md p-4 min-h-24">
                        {watchedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {watchedSkills.map((skill, index) => (
                              <span
                                key={skill}
                                className={`${skillColors[index % skillColors.length]} text-white px-3 py-1.5 text-sm flex items-center gap-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300`}
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-1 hover:text-red-300 transition-colors focus:outline-none"
                                  aria-label={`Remove ${skill}`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-center py-4">No skills selected yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md"
              >
                Save Profile
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex -space-x-2 mr-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xl font-bold">J</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold">S</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Profile Completion</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm flex items-center">
                  Profile update tips
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Need full spotlight in order to qualify for receiving invitations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>You have unlocked 35pts out of possible 100pts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Credibility Graph Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Credibility Graph</h3>
                <div className="flex items-center space-x-2">
                  <button className="bg-gray-700 px-3 py-1 rounded-md text-sm">Details</button>
                  <button className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="h-44 relative">
                {/* Graph Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
                  <div>4k</div>
                  <div>3k</div>
                  <div>2k</div>
                  <div>0</div>
                </div>
                
                {/* Graph */}
                <div className="ml-6 h-full relative">
                  {/* Grid Lines */}
                  <div className="absolute w-full h-1/4 border-t border-gray-700"></div>
                  <div className="absolute w-full h-2/4 border-t border-gray-700"></div>
                  <div className="absolute w-full h-3/4 border-t border-gray-700"></div>
                  <div className="absolute w-full h-full border-t border-gray-700"></div>
                  
                  {/* X Axis Labels */}
                  <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400 mt-2">
                    <div>21 Mar</div>
                    <div>23 Mar</div>
                    <div>25 Mar</div>
                  </div>
                  
                  {/* Line */}
                  <div className="absolute h-full w-full">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d="M0,100 L50,50 L100,20"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    
                    {/* Points */}
                    <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 bg-white rounded-full border-2 border-white relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-900 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                          2803
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}