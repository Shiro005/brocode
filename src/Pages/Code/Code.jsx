import React from 'react';

const learningPaths = [
  {
    title: "Frontend Development Roadmap",
    stages: [
      {
        title: "Basics",
        topics: ["HTML", "CSS", "JavaScript"]
      },
      {
        title: "Frameworks & Libraries",
        topics: ["React.js", "Vue.js", "Angular"]
      },
      {
        title: "State Management",
        topics: ["Redux", "Context API"]
      }
    ]
  },
  {
    title: "Backend Development Roadmap",
    stages: [
      {
        title: "Programming Languages",
        topics: ["Node.js", "Python", "Ruby"]
      },
      {
        title: "Databases",
        topics: ["MongoDB", "PostgreSQL", "MySQL"]
      },
      {
        title: "Authentication & Security",
        topics: ["JWT", "OAuth", "Encryption"]
      }
    ]
  },
  {
    title: "DevOps Roadmap",
    stages: [
      {
        title: "Version Control",
        topics: ["Git", "GitHub", "GitLab"]
      },
      {
        title: "CI/CD",
        topics: ["Jenkins", "GitHub Actions", "CircleCI"]
      },
      {
        title: "Cloud Services",
        topics: ["AWS", "Google Cloud", "Azure"]
      }
    ]
  }
];

function Code() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-8 text-center">Trending Tech Roadmaps</h1>
      <div className="space-y-12">
        {learningPaths.map((path, index) => (
          <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-purple-600/20 transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              {path.title}
            </h2>
            <div className="space-y-4">
              {path.stages.map((stage, stageIndex) => (
                <div key={stageIndex} className="border-l-4 border-purple-600 pl-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{stage.title}</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-300">
                    {stage.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="hover:text-purple-400 transition-colors duration-200">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Code;