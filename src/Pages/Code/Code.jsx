import React, { useState } from 'react';

const learningPaths = [
  {
    title: "Frontend Development Roadmap",
    icon: "👨‍💻",
    color: "from-pink-500 to-purple-600",
    stages: [
      {
        title: "Basics",
        topics: ["HTML", "CSS", "JavaScript"],
        resources: [
          { name: "HTML Crash Course", link: "https://example.com/html" },
          { name: "CSS Basics", link: "https://example.com/css" },
          { name: "JavaScript Fundamentals", link: "https://example.com/js" }
        ]
      },
      {
        title: "Frameworks & Libraries",
        topics: ["React.js", "Vue.js", "Angular"],
        resources: [
          { name: "React Official Docs", link: "https://reactjs.org" },
          { name: "Vue.js Guide", link: "https://vuejs.org" },
          { name: "Angular Tutorial", link: "https://angular.io" }
        ]
      },
      {
        title: "State Management",
        topics: ["Redux", "Context API"],
        resources: [
          { name: "Redux Crash Course", link: "https://example.com/redux" },
          { name: "Context API Guide", link: "https://reactjs.org/docs/context.html" }
        ]
      }
    ]
  },
  {
    title: "Backend Development Roadmap",
    icon: "🔧",
    color: "from-cyan-500 to-blue-600",
    stages: [
      {
        title: "Programming Languages",
        topics: ["Node.js", "Python", "Ruby"],
        resources: [
          { name: "Node.js Tutorial", link: "https://nodejs.org" },
          { name: "Python for Beginners", link: "https://python.org" },
          { name: "Ruby on Rails Guide", link: "https://rubyonrails.org" }
        ]
      },
      {
        title: "Databases",
        topics: ["MongoDB", "PostgreSQL", "MySQL"],
        resources: [
          { name: "MongoDB Basics", link: "https://mongodb.com" },
          { name: "PostgreSQL Tutorial", link: "https://postgresql.org" },
          { name: "MySQL Crash Course", link: "https://mysql.com" }
        ]
      },
      {
        title: "Authentication & Security",
        topics: ["JWT", "OAuth", "Encryption"],
        resources: [
          { name: "JWT Explained", link: "https://jwt.io" },
          { name: "OAuth Guide", link: "https://oauth.net" },
          { name: "Encryption Basics", link: "https://example.com/encryption" }
        ]
      }
    ]
  },
  {
    title: "DevOps Roadmap",
    icon: "🚀",
    color: "from-green-500 to-teal-600",
    stages: [
      {
        title: "Version Control",
        topics: ["Git", "GitHub", "GitLab"],
        resources: [
          { name: "Git Basics", link: "https://git-scm.com" },
          { name: "GitHub Tutorial", link: "https://github.com" },
          { name: "GitLab Guide", link: "https://gitlab.com" }
        ]
      },
      {
        title: "CI/CD",
        topics: ["Jenkins", "GitHub Actions", "CircleCI"],
        resources: [
          { name: "Jenkins Tutorial", link: "https://jenkins.io" },
          { name: "GitHub Actions Guide", link: "https://github.com/features/actions" },
          { name: "CircleCI Docs", link: "https://circleci.com" }
        ]
      },
      {
        title: "Cloud Services",
        topics: ["AWS", "Google Cloud", "Azure"],
        resources: [
          { name: "AWS Basics", link: "https://aws.amazon.com" },
          { name: "Google Cloud Tutorial", link: "https://cloud.google.com" },
          { name: "Azure Guide", link: "https://azure.microsoft.com" }
        ]
      }
    ]
  }
];

function Code() {
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [expandedStages, setExpandedStages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  
  const toggleStage = (pathIndex, stageIndex) => {
    setExpandedStages(prev => {
      const key = `${pathIndex}-${stageIndex}`;
      return { ...prev, [key]: !prev[key] };
    });
  };
  
  const openPathDetails = (index) => {
    setSelectedPath(index);
    setShowModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-70 h-70 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className=" z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4 animate-gradient-x">
            Master Your Tech Career
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive roadmaps to guide your journey in tech — from beginner to professional
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setActivePathIndex(0)} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition duration-300 transform hover:-translate-y-1">
              Frontend Path
            </button>
            <button onClick={() => setActivePathIndex(1)} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition duration-300 transform hover:-translate-y-1">
              Backend Path
            </button>
            <button onClick={() => setActivePathIndex(2)} className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition duration-300 transform hover:-translate-y-1">
              DevOps Path
            </button>
          </div>
        </div>
        
        {/* Beginner's Guide Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl shadow-xl mb-12 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-8 -mt-8 filter blur-2xl group-hover:bg-purple-600/20 transition-all duration-500"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-4 flex items-center">
            <span className="text-2xl mr-2">✨</span> Welcome Beginner! Where to Start?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-xl border border-gray-700 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 transform hover:-translate-y-1">
              <div className="text-pink-500 text-2xl font-bold mb-2">01</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Choose Your Path</h3>
              <p className="text-gray-300">
                Decide whether you want to focus on Frontend, Backend, or DevOps based on your interests.
              </p>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 transform hover:-translate-y-1">
              <div className="text-purple-500 text-2xl font-bold mb-2">02</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Learn the Basics</h3>
              <p className="text-gray-300">
                Master the foundational technologies for your chosen path before advancing.
              </p>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1">
              <div className="text-blue-500 text-2xl font-bold mb-2">03</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Build Projects</h3>
              <p className="text-gray-300">
                Apply your knowledge by creating projects for your portfolio to showcase skills.
              </p>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-xl border border-gray-700 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 transform hover:-translate-y-1">
              <div className="text-teal-500 text-2xl font-bold mb-2">04</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Go Advanced</h3>
              <p className="text-gray-300">
                Explore specialized frameworks, tools, and techniques to elevate your expertise.
              </p>
            </div>
          </div>
        </div>
        
        {/* Path Cards Section - Only show the active path */}
        <div className="mb-8">
          <div key={activePathIndex} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-opacity-50 hover:border-purple-500 transition-all duration-300">
            <div className={`bg-gradient-to-r ${learningPaths[activePathIndex].color} p-6 md:p-8`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
                  <span className="text-3xl mr-3">{learningPaths[activePathIndex].icon}</span>
                  {learningPaths[activePathIndex].title}
                </h2>
                <button 
                  onClick={() => openPathDetails(activePathIndex)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              {learningPaths[activePathIndex].stages.map((stage, stageIndex) => {
                const isExpanded = expandedStages[`${activePathIndex}-${stageIndex}`];
                return (
                  <div 
                    key={stageIndex} 
                    className="border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
                  >
                    <div 
                      className="p-4 bg-gray-800/50 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleStage(activePathIndex, stageIndex)}
                    >
                      <h3 className="text-xl font-semibold text-white flex items-center">
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${learningPaths[activePathIndex].color} flex items-center justify-center mr-3`}>
                          {stageIndex + 1}
                        </div>
                        {stage.title}
                      </h3>
                      <span className="transform transition-transform duration-300">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 bg-gray-800/30 space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">Key Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {stage.topics.map((topic, topicIndex) => (
                              <span 
                                key={topicIndex} 
                                className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white hover:bg-purple-600 transition-colors duration-300"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">Learning Resources:</h4>
                          <ul className="space-y-2">
                            {stage.resources.map((resource, resourceIndex) => (
                              <li key={resourceIndex} className="flex items-center">
                                <span className="text-purple-500 mr-2">→</span>
                                <a 
                                  href={resource.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 underline"
                                >
                                  {resource.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Path Selection Cards - Show all paths */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Explore All Roadmaps</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <div 
              key={index} 
              className={`bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-opacity-50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 ${activePathIndex === index ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setActivePathIndex(index)}
            >
              <div className={`h-2 w-full bg-gradient-to-r ${path.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{path.icon}</span>
                  <h3 className="text-xl font-bold text-white">{path.title}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  {index === 0 ? "Learn to create beautiful, responsive user interfaces" : 
                   index === 1 ? "Build server-side logic and manage data efficiently" : 
                   "Master deployment and infrastructure management"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{path.stages.length} stages</span>
                  <button 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${path.color} text-white hover:shadow-md transition-all duration-300`}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Sign-up */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest tech roadmaps and resources delivered to your inbox</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white w-full sm:w-64"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Path Details Modal */}
      {showModal && selectedPath !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className={`bg-gradient-to-r ${learningPaths[selectedPath].color} p-6`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {learningPaths[selectedPath].icon} {learningPaths[selectedPath].title}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Complete Roadmap Overview</h3>
                <p className="text-gray-300 mb-4">
                  {selectedPath === 0 ? 
                    "Front-end development focuses on creating the visual and interactive elements of websites and applications that users directly interact with. This roadmap will guide you from the basic building blocks to advanced frameworks and optimization techniques." :
                    selectedPath === 1 ?
                    "Back-end development involves building the server-side logic that powers web applications. This roadmap covers server programming, databases, APIs, and the infrastructure that supports the user-facing features." :
                    "DevOps bridges development and operations, focusing on automating and integrating processes to improve and shorten the systems development life cycle. This path will teach you version control, CI/CD, cloud services, and monitoring."
                  }
                </p>
              </div>
              
              <div className="space-y-8">
                {learningPaths[selectedPath].stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <span className={`inline-block h-8 w-8 rounded-full bg-gradient-to-r ${learningPaths[selectedPath].color} text-center mr-3`}>
                        {stageIndex + 1}
                      </span>
                      {stage.title}
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">Topics to Master:</h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.topics.map((topic, topicIndex) => (
                          <span 
                            key={topicIndex} 
                            className="px-4 py-2 bg-gray-700 rounded-full text-white hover:bg-purple-600 transition-colors duration-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">Recommended Resources:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stage.resources.map((resource, resourceIndex) => (
                          <li 
                            key={resourceIndex} 
                            className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                          >
                            <a 
                              href={resource.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center"
                            >
                              <span className="text-purple-500 mr-2">→</span>
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">Estimated Time to Complete:</h4>
                      <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${learningPaths[selectedPath].color}`} 
                          style={{width: `${100 - (stageIndex * 20)}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>
                          {stageIndex === 0 ? "2-4 weeks" : 
                           stageIndex === 1 ? "4-8 weeks" : "6-12 weeks"}
                        </span>
                        <span>Difficulty: {stageIndex === 0 ? "Beginner" : stageIndex === 1 ? "Intermediate" : "Advanced"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-3 bg-gradient-to-r ${learningPaths[selectedPath].color} rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300`}
                >
                  Start This Path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS animation for the background blobs */}
      {/* <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style> */}
    </div>
  );
}

export default Code;