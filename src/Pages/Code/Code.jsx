import React from 'react';

const learningPaths = [
  {
    title: "Frontend Development Roadmap",
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
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-8 text-center">Trending Tech Roadmaps</h1>
      
      {/* Beginner's Guide Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">Welcome Beginner! 👋</h2>
        <p className="text-gray-300 mb-4">
          If you're new to the tech world, don't worry! We've got you covered. Here's a simple guide to help you get started:
        </p>
        <div className="space-y-4">
          <div className="border-l-4 border-purple-600 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-white">Step 1: Choose Your Path</h3>
            <p className="text-gray-300">
              Decide whether you want to focus on <strong>Frontend</strong> (what users see), <strong>Backend</strong> (server-side logic), or <strong>DevOps</strong> (deployment and infrastructure).
            </p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-white">Step 2: Learn the Basics</h3>
            <p className="text-gray-300">
              Start with the fundamentals like HTML, CSS, and JavaScript for Frontend, or programming languages like Python for Backend.
            </p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-white">Step 3: Practice & Build Projects</h3>
            <p className="text-gray-300">
              Apply what you learn by building small projects. This will help you understand concepts better and build a portfolio.
            </p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-white">Step 4: Explore Advanced Topics</h3>
            <p className="text-gray-300">
              Once you're comfortable with the basics, dive into frameworks, libraries, and tools like React, Node.js, or AWS.
            </p>
          </div>
        </div>
      </div>

      {/* Learning Paths Section */}
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
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Resources:</h4>
                    <ul className="space-y-1">
                      {stage.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                          <a href={resource.link} target="_blank" rel="noopener noreferrer" className="underline">
                            {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
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