import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Code = () => {
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [expandedStages, setExpandedStages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [youtubeVideos, setYoutubeVideos] = useState({});
  const [documentation, setDocumentation] = useState({});
  const [loading, setLoading] = useState(false);

  // Enhanced learning paths with real resources
  const learningPaths = [
    {
      title: "Frontend Development Roadmap",
      icon: "👨‍💻",
      color: "from-pink-500 to-purple-600",
      description: "Master the art of creating beautiful, interactive user interfaces and web applications",
      duration: "6-9 months",
      difficulty: "Beginner to Advanced",
      stages: [
        {
          title: "Web Fundamentals",
          duration: "4-6 weeks",
          difficulty: "Beginner",
          topics: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "Accessibility"],
          resources: [
            {
              name: "MDN Web Docs - HTML",
              link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
              type: "documentation",
              free: true
            },
            {
              name: "CSS Tricks Complete Guide",
              link: "https://css-tricks.com/guides/",
              type: "tutorial",
              free: true
            },
            {
              name: "JavaScript.info Modern Tutorial",
              link: "https://javascript.info/",
              type: "tutorial",
              free: true
            },
            {
              name: "FreeCodeCamp Responsive Web Design",
              link: "https://www.freecodecamp.org/learn/responsive-web-design/",
              type: "course",
              free: true
            }
          ],
          projects: ["Personal Portfolio", "Restaurant Website", "Blog Layout", "Product Landing Page"]
        },
        {
          title: "Frontend Frameworks & Libraries",
          duration: "8-12 weeks",
          difficulty: "Intermediate",
          topics: ["React.js", "Vue.js", "Angular", "State Management", "Component Architecture"],
          resources: [
            {
              name: "React Official Documentation",
              link: "https://reactjs.org/docs/getting-started.html",
              type: "documentation",
              free: true
            },
            {
              name: "Vue.js Guide",
              link: "https://vuejs.org/guide/introduction.html",
              type: "documentation",
              free: true
            },
            {
              name: "Angular University",
              link: "https://angular-university.io/",
              type: "course",
              free: false
            },
            {
              name: "Redux Fundamentals",
              link: "https://redux.js.org/fundamentals/usage",
              type: "documentation",
              free: true
            }
          ],
          projects: ["Todo App", "Weather App", "E-commerce Product Page", "Social Media Dashboard"]
        },
        {
          title: "Advanced Frontend & Tooling",
          duration: "6-10 weeks",
          difficulty: "Advanced",
          topics: ["TypeScript", "Next.js/Nuxt.js", "Web Performance", "Testing", "Build Tools"],
          resources: [
            {
              name: "TypeScript Handbook",
              link: "https://www.typescriptlang.org/docs/",
              type: "documentation",
              free: true
            },
            {
              name: "Next.js Documentation",
              link: "https://nextjs.org/docs",
              type: "documentation",
              free: true
            },
            {
              name: "Web Dev Performance Guide",
              link: "https://web.dev/performance/",
              type: "tutorial",
              free: true
            },
            {
              name: "Jest Testing Framework",
              link: "https://jestjs.io/docs/getting-started",
              type: "documentation",
              free: true
            }
          ],
          projects: ["Full-stack Blog", "Real-time Chat App", "Progressive Web App", "Dashboard with Analytics"]
        },
        {
          title: "Production Ready Skills",
          duration: "4-8 weeks",
          difficulty: "Expert",
          topics: ["Web Security", "SEO Optimization", "Cross-browser Compatibility", "Progressive Web Apps"],
          resources: [
            {
              name: "OWASP Security Guide",
              link: "https://owasp.org/www-project-top-ten/",
              type: "documentation",
              free: true
            },
            {
              name: "Google SEO Basics",
              link: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
              type: "tutorial",
              free: true
            },
            {
              name: "PWA Documentation",
              link: "https://web.dev/progressive-web-apps/",
              type: "documentation",
              free: true
            },
            {
              name: "Browser Compatibility Guide",
              link: "https://caniuse.com/",
              type: "reference",
              free: true
            }
          ],
          projects: ["Enterprise Dashboard", "E-commerce Platform", "Social Network", "SaaS Application"]
        }
      ]
    },
    {
      title: "Backend Development Roadmap",
      icon: "🔧",
      color: "from-cyan-500 to-blue-600",
      description: "Build robust server-side applications, APIs, and manage data efficiently",
      duration: "7-10 months",
      difficulty: "Beginner to Advanced",
      stages: [
        {
          title: "Backend Fundamentals",
          duration: "6-8 weeks",
          difficulty: "Beginner",
          topics: ["Node.js/Python", "REST APIs", "HTTP Protocols", "Basic Authentication"],
          resources: [
            {
              name: "Node.js Official Docs",
              link: "https://nodejs.org/en/docs/",
              type: "documentation",
              free: true
            },
            {
              name: "Python Official Tutorial",
              link: "https://docs.python.org/3/tutorial/",
              type: "documentation",
              free: true
            },
            {
              name: "MDN HTTP Guide",
              link: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
              type: "tutorial",
              free: true
            },
            {
              name: "REST API Tutorial",
              link: "https://restfulapi.net/",
              type: "tutorial",
              free: true
            }
          ],
          projects: ["Simple CRUD API", "Weather API Consumer", "Blog Backend", "User Authentication System"]
        },
        {
          title: "Databases & Data Modeling",
          duration: "8-12 weeks",
          difficulty: "Intermediate",
          topics: ["SQL Databases", "NoSQL Databases", "Database Design", "ORM/ODM"],
          resources: [
            {
              name: "PostgreSQL Tutorial",
              link: "https://www.postgresqltutorial.com/",
              type: "tutorial",
              free: true
            },
            {
              name: "MongoDB University",
              link: "https://university.mongodb.com/",
              type: "course",
              free: true
            },
            {
              name: "MySQL Documentation",
              link: "https://dev.mysql.com/doc/",
              type: "documentation",
              free: true
            },
            {
              name: "Prisma ORM Guide",
              link: "https://www.prisma.io/docs/",
              type: "documentation",
              free: true
            }
          ],
          projects: ["E-commerce Database", "Social Media Data Model", "Analytics Dashboard Backend", "Multi-tenant Application"]
        },
        {
          title: "Advanced Backend Concepts",
          duration: "10-14 weeks",
          difficulty: "Advanced",
          topics: ["Microservices", "Message Queues", "Caching", "API Security", "WebSockets"],
          resources: [
            {
              name: "Microservices.io Patterns",
              link: "https://microservices.io/patterns/",
              type: "reference",
              free: true
            },
            {
              name: "Redis Documentation",
              link: "https://redis.io/documentation",
              type: "documentation",
              free: true
            },
            {
              name: "JWT.io Introduction",
              link: "https://jwt.io/introduction",
              type: "tutorial",
              free: true
            },
            {
              name: "Socket.io Guide",
              link: "https://socket.io/docs/v4/",
              type: "documentation",
              free: true
            }
          ],
          projects: ["Real-time Chat System", "Microservices Architecture", "Caching Implementation", "Secure Payment System"]
        },
        {
          title: "DevOps & Deployment",
          duration: "6-10 weeks",
          difficulty: "Expert",
          topics: ["Docker", "CI/CD", "Cloud Platforms", "Monitoring", "Scaling"],
          resources: [
            {
              name: "Docker Get Started",
              link: "https://docs.docker.com/get-started/",
              type: "documentation",
              free: true
            },
            {
              name: "AWS Free Tier",
              link: "https://aws.amazon.com/free/",
              type: "platform",
              free: true
            },
            {
              name: "GitHub Actions Docs",
              link: "https://docs.github.com/en/actions",
              type: "documentation",
              free: true
            },
            {
              name: "Prometheus Monitoring",
              link: "https://prometheus.io/docs/introduction/overview/",
              type: "documentation",
              free: true
            }
          ],
          projects: ["Containerized Application", "CI/CD Pipeline", "Cloud Deployment", "Monitoring Setup"]
        }
      ]
    },
    {
      title: "Full Stack Development Roadmap",
      icon: "🚀",
      color: "from-green-500 to-teal-600",
      description: "Become a versatile developer mastering both frontend and backend technologies",
      duration: "10-14 months",
      difficulty: "Intermediate to Expert",
      stages: [
        {
          title: "Full Stack Foundation",
          duration: "8-12 weeks",
          difficulty: "Intermediate",
          topics: ["MERN Stack", "Database Integration", "API Development", "Basic Deployment"],
          resources: [
            {
              name: "MERN Stack Tutorial",
              link: "https://www.mongodb.com/mern-stack",
              type: "tutorial",
              free: true
            },
            {
              name: "Full Stack Open",
              link: "https://fullstackopen.com/en/",
              type: "course",
              free: true
            },
            {
              name: "Express.js Guide",
              link: "https://expressjs.com/en/guide/routing.html",
              type: "documentation",
              free: true
            },
            {
              name: "Vercel Deployment",
              link: "https://vercel.com/docs",
              type: "platform",
              free: true
            }
          ],
          projects: ["Full-stack Blog", "Task Management App", "E-commerce Store", "Social Media Platform"]
        },
        {
          title: "Advanced Full Stack Patterns",
          duration: "10-14 weeks",
          difficulty: "Advanced",
          topics: ["Server-side Rendering", "GraphQL", "Authentication Strategies", "Performance Optimization"],
          resources: [
            {
              name: "Next.js Full Stack Guide",
              link: "https://nextjs.org/learn/foundations/about-nextjs",
              type: "tutorial",
              free: true
            },
            {
              name: "GraphQL Official Tutorial",
              link: "https://graphql.org/learn/",
              type: "tutorial",
              free: true
            },
            {
              name: "OAuth 2.0 Simplified",
              link: "https://oauth.net/2/",
              type: "tutorial",
              free: true
            },
            {
              name: "Web Vitals Guide",
              link: "https://web.dev/vitals/",
              type: "tutorial",
              free: true
            }
          ],
          projects: ["SSR Application", "GraphQL API", "OAuth Implementation", "Performance-focused App"]
        },
        {
          title: "Enterprise Full Stack",
          duration: "12-16 weeks",
          difficulty: "Expert",
          topics: ["Micro-frontends", "Microservices", "Event-driven Architecture", "Advanced Security"],
          resources: [
            {
              name: "Micro-frontends Guide",
              link: "https://micro-frontends.org/",
              type: "tutorial",
              free: true
            },
            {
              name: "Domain Driven Design",
              link: "https://domainlanguage.com/ddd/",
              type: "book",
              free: false
            },
            {
              name: "Event Sourcing Pattern",
              link: "https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing",
              type: "tutorial",
              free: true
            },
            {
              name: "OWASP Security Guide",
              link: "https://owasp.org/www-project-top-ten/",
              type: "documentation",
              free: true
            }
          ],
          projects: ["Micro-frontend Architecture", "Event-driven System", "Enterprise Application", "Secure Banking App"]
        }
      ]
    }
  ];

  // Fetch YouTube videos for each technology
  const fetchYouTubeVideos = async (technology) => {
    // In a real app, you would use YouTube API
    // For demo, we'll use mock data
    const mockVideos = {
      'react': [
        { title: "React Crash Course 2024", duration: "2:15:30", views: "1.2M", channel: "Traversy Media" },
        { title: "Learn React In 1 Hour", duration: "1:01:25", views: "890K", channel: "Programming with Mosh" },
        { title: "React Hooks Explained", duration: "45:18", views: "540K", channel: "Web Dev Simplified" }
      ],
      'javascript': [
        { title: "JavaScript Fundamentals", duration: "3:45:12", views: "2.1M", channel: "freeCodeCamp" },
        { title: "Modern JavaScript Tutorial", duration: "1:30:45", views: "1.5M", channel: "The Net Ninja" }
      ],
      'nodejs': [
        { title: "Node.js Full Course", duration: "4:20:10", views: "980K", channel: "freeCodeCamp" },
        { title: "Build REST API with Node.js", duration: "2:15:30", views: "670K", channel: "Web Dev Simplified" }
      ]
    };

    return mockVideos[technology.toLowerCase()] || [];
  };

  // Fetch documentation from real APIs
  const fetchDocumentation = async (technology) => {
    // Mock documentation data - in real app, fetch from MDN or official docs
    const mockDocs = {
      'react': {
        official: "https://reactjs.org/docs",
        community: "https://react-tutorial.app",
        examples: "https://react-by-example.com"
      },
      'javascript': {
        official: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        community: "https://javascript.info",
        examples: "https://jsfiddle.net"
      },
      'nodejs': {
        official: "https://nodejs.org/en/docs",
        community: "https://nodejs.dev/learn",
        examples: "https://github.com/nodejs/examples"
      }
    };

    return mockDocs[technology.toLowerCase()] || {};
  };

  const toggleStage = (pathIndex, stageIndex) => {
    setExpandedStages(prev => {
      const key = `${pathIndex}-${stageIndex}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const openPathDetails = async (index) => {
    setSelectedPath(index);
    setLoading(true);

    // Fetch additional data for the selected path
    const path = learningPaths[index];
    const videoData = {};
    const docData = {};

    // Get unique technologies from the path
    const technologies = [...new Set(path.stages.flatMap(stage => stage.topics))];

    for (const tech of technologies.slice(0, 5)) { // Limit to 5 technologies
      videoData[tech] = await fetchYouTubeVideos(tech);
      docData[tech] = await fetchDocumentation(tech);
    }

    setYoutubeVideos(videoData);
    setDocumentation(docData);
    setShowModal(true);
    setLoading(false);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'tutorial': return '🎓';
      case 'course': return '📹';
      case 'platform': return '🌐';
      case 'reference': return '🔍';
      case 'book': return '📖';
      default: return '📄';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const navigate = useNavigate();


  return (
    <div className="z-auto bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-70 h-70 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </button>
        <div className="text-center mt-5 mb-16">
          <h1 className="text-3xl  md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 animate-gradient-x">
            Master Your Tech Career
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Comprehensive, up-to-date roadmaps with real resources, documentation, and community-voted learning paths to guide your journey from beginner to professional developer.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActivePathIndex(0)}
              className={`px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${activePathIndex === 0
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-2xl shadow-pink-500/30 scale-105'
                  : 'bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 hover:shadow-pink-500/20'
                }`}
            >
              👨‍💻 Frontend Path
            </button>
            <button
              onClick={() => setActivePathIndex(1)}
              className={`px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${activePathIndex === 1
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-2xl shadow-blue-500/30 scale-105'
                  : 'bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/20'
                }`}
            >
              🔧 Backend Path
            </button>
            <button
              onClick={() => setActivePathIndex(2)}
              className={`px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${activePathIndex === 2
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 shadow-2xl shadow-green-500/30 scale-105'
                  : 'bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-green-500/50 hover:shadow-green-500/20'
                }`}
            >
              🚀 Full Stack Path
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:border-purple-500/30 transition-all duration-300">
            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-gray-300">Learning Paths</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:border-blue-500/30 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">11</div>
            <div className="text-gray-300">Stages Total</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:border-green-500/30 transition-all duration-300">
            <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
            <div className="text-gray-300">Technologies</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center hover:border-pink-500/30 transition-all duration-300">
            <div className="text-3xl font-bold text-pink-400 mb-2">100+</div>
            <div className="text-gray-300">Resources</div>
          </div>
        </div>

        {/* Beginner's Guide Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl mb-16 border border-gray-700 hover:border-purple-500/50 transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full -mr-10 -mt-10 filter blur-3xl group-hover:bg-purple-600/20 transition-all duration-500"></div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-6 flex items-center">
            <span className="text-3xl mr-3">✨</span> Your Learning Journey Starts Here
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Choose Your Path", desc: "Select Frontend, Backend, or Full Stack based on your interests and career goals", color: "pink" },
              { step: "02", title: "Master Fundamentals", desc: "Build strong foundation with core technologies before moving to advanced topics", color: "purple" },
              { step: "03", title: "Build Real Projects", desc: "Apply knowledge by creating portfolio projects that showcase your skills", color: "blue" },
              { step: "04", title: "Go Advanced & Specialize", desc: "Explore specialized areas and stay updated with latest technologies", color: "teal" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-2">
                <div className={`text-${item.color}-500 text-2xl font-bold mb-3`}>{item.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Path Display */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-500">
            <div className={`bg-gradient-to-r ${learningPaths[activePathIndex].color} p-8`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3 flex items-center">
                    <span className="text-4xl mr-4">{learningPaths[activePathIndex].icon}</span>
                    {learningPaths[activePathIndex].title}
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl">
                    {learningPaths[activePathIndex].description}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openPathDetails(activePathIndex)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105"
                  >
                    View Complete Roadmap
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">
                  ⏱️ {learningPaths[activePathIndex].duration}
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">
                  🎯 {learningPaths[activePathIndex].difficulty}
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">
                  📚 {learningPaths[activePathIndex].stages.length} Stages
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {learningPaths[activePathIndex].stages.map((stage, stageIndex) => {
                const isExpanded = expandedStages[`${activePathIndex}-${stageIndex}`];
                return (
                  <div
                    key={stageIndex}
                    className="border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 bg-gray-800/50"
                  >
                    <div
                      className="p-6 bg-gray-800/70 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-all duration-300"
                      onClick={() => toggleStage(activePathIndex, stageIndex)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${learningPaths[activePathIndex].color} flex items-center justify-center text-white font-bold text-lg`}>
                          {stageIndex + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {stage.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-sm text-gray-400">⏱️ {stage.duration}</span>
                            <span className={`text-sm ${getDifficultyColor(stage.difficulty)}`}>
                              🎯 {stage.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-2xl transform transition-transform duration-300">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="p-6 bg-gray-800/30 space-y-6">
                        {/* Topics */}
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                            <span className="mr-2">📖</span> Technologies & Concepts
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {stage.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-4 py-2 bg-gray-700 rounded-xl text-white hover:bg-purple-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Learning Resources */}
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                            <span className="mr-2">🎓</span> Learning Resources
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {stage.resources.map((resource, resourceIndex) => (
                              <a
                                key={resourceIndex}
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-600 hover:border-purple-500/50 group"
                              >
                                <div className="flex items-start space-x-3">
                                  <span className="text-xl">{getResourceIcon(resource.type)}</span>
                                  <div>
                                    <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                      {resource.name}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-sm text-gray-400">{resource.type}</span>
                                      <span className="text-sm text-gray-400">•</span>
                                      <span className={`text-sm ${resource.free ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {resource.free ? 'Free' : 'Paid'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Project Ideas */}
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                            <span className="mr-2">💡</span> Project Ideas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stage.projects.map((project, projectIndex) => (
                              <span
                                key={projectIndex}
                                className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm"
                              >
                                {project}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* All Paths Overview */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Explore All Career Paths</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {learningPaths.map((path, index) => (
            <div
              key={index}
              className={`bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${activePathIndex === index
                  ? 'border-purple-500 ring-2 ring-purple-500/30'
                  : 'border-gray-700 hover:border-purple-500/50'
                }`}
              onClick={() => setActivePathIndex(index)}
            >
              <div className={`h-3 w-full bg-gradient-to-r ${path.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{path.icon}</span>
                  <h3 className="text-xl font-bold text-white">{path.title}</h3>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {path.description}
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{path.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <span className={`${getDifficultyColor(path.difficulty)}`}>{path.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stages</span>
                    <span className="text-white">{path.stages.length}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{path.stages.reduce((acc, stage) => acc + stage.topics.length, 0)} technologies</span>
                  <button
                    className={`px-4 py-2 rounded-xl text-white font-medium bg-gradient-to-r ${path.color} hover:shadow-lg transition-all duration-300`}
                  >
                    {activePathIndex === index ? 'Selected' : 'Explore'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community & Newsletter */}
        <div className="mb-10 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-purple-500/20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:mr-8">
              <h3 className="text-2xl font-bold text-white mb-3">Join Our Learning Community</h3>
              <p className="text-gray-300 max-w-md">
                Get weekly updates with new resources, project ideas, and career advice from industry experts.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white w-full sm:w-64 placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2 text-center sm:text-left">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Path Details Modal */}
      {showModal && selectedPath !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <div className={`bg-gradient-to-r ${learningPaths[selectedPath].color} p-8`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {learningPaths[selectedPath].icon} {learningPaths[selectedPath].title}
                  </h2>
                  <p className="text-white/90 text-lg max-w-3xl">
                    {learningPaths[selectedPath].description}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-2xl p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Path Overview */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">🎯 Path Overview</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{learningPaths[selectedPath].stages.length}</div>
                    <div className="text-gray-300">Learning Stages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {learningPaths[selectedPath].stages.reduce((acc, stage) => acc + stage.topics.length, 0)}
                    </div>
                    <div className="text-gray-300">Technologies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {learningPaths[selectedPath].stages.reduce((acc, stage) => acc + stage.resources.length, 0)}+
                    </div>
                    <div className="text-gray-300">Resources</div>
                  </div>
                </div>
              </div>

              {/* Detailed Stages */}
              <div className="space-y-8">
                {learningPaths[selectedPath].stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center mb-6">
                      <span className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-r ${learningPaths[selectedPath].color} text-white font-bold text-lg mr-4`}>
                        {stageIndex + 1}
                      </span>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{stage.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="text-gray-400">⏱️ {stage.duration}</span>
                          <span className={`${getDifficultyColor(stage.difficulty)}`}>🎯 {stage.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies to Master</h4>
                      <div className="flex flex-wrap gap-3">
                        {stage.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="px-4 py-2 bg-gray-700 rounded-xl text-white hover:bg-purple-600 transition-colors duration-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Resources */}
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Learning Resources</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {stage.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-600 hover:border-purple-500/50 group"
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-xl mt-1">{getResourceIcon(resource.type)}</span>
                              <div className="flex-1">
                                <div className="font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">
                                  {resource.name}
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                  <span className="text-gray-400">{resource.type}</span>
                                  <span className={`${resource.free ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {resource.free ? 'Free' : 'Paid'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Project Ideas */}
                    <div>
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Project Ideas</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {stage.projects.map((project, projectIndex) => (
                          <div
                            key={projectIndex}
                            className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-900/30 transition-colors duration-300"
                          >
                            <span className="text-purple-400 mr-2">💡</span>
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">Estimated Progress</h4>
                      <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${learningPaths[selectedPath].color} transition-all duration-1000`}
                          style={{ width: `${((stageIndex + 1) / learningPaths[selectedPath].stages.length) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>Stage {stageIndex + 1} of {learningPaths[selectedPath].stages.length}</span>
                        <span>{Math.round(((stageIndex + 1) / learningPaths[selectedPath].stages.length) * 100)}% Complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="flex justify-center mt-8 ">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-8 py-4 bg-gradient-to-r ${learningPaths[selectedPath].color} rounded-2xl text-white font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  Start This Learning Path 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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
      `}</style>
    </div>
  );
}

export default Code;