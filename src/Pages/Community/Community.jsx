import React, { useState } from 'react';

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const communityData = {
    platforms: [
      {
        name: "Discord Communities",
        communities: [
          {
            name: "React Developers",
            description: "A community for React developers to discuss, learn, and share knowledge.",
            link: "https://discord.gg/react",
          },
          {
            name: "Node.js Community",
            description: "Connect with Node.js developers and get help with your projects.",
            link: "https://discord.gg/nodejs",
          },
          {
            name: "Web Dev Hub",
            description: "A place to discuss all things web development.",
            link: "https://discord.gg/webdev",
          },
          {
            name: "Python Enthusiasts",
            description: "A community for Python developers to share projects and ideas.",
            link: "https://discord.gg/python",
          },
        ],
      },
      {
        name: "Reddit Communities",
        communities: [
          {
            name: "r/webdev",
            description: "Discussion and sharing of web development resources and experiences.",
            link: "https://reddit.com/r/webdev",
          },
          {
            name: "r/learnprogramming",
            description: "A supportive community for beginners learning to code.",
            link: "https://reddit.com/r/learnprogramming",
          },
          {
            name: "r/javascript",
            description: "A subreddit dedicated to JavaScript news and discussions.",
            link: "https://reddit.com/r/javascript",
          },
          {
            name: "r/opensource",
            description: "A community for open-source enthusiasts and contributors.",
            link: "https://reddit.com/r/opensource",
          },
        ],
      },
      {
        name: "Twitter Tech Communities",
        communities: [
          {
            name: "Frontend Devs",
            description: "A Twitter space where frontend developers share insights and tips.",
            link: "https://twitter.com/frontenddevs",
          },
          {
            name: "AI & ML Enthusiasts",
            description: "A space for discussions on AI and machine learning advancements.",
            link: "https://twitter.com/aimlenthusiasts",
          },
          {
            name: "DevOps Engineers",
            description: "A community for DevOps professionals to share best practices.",
            link: "https://twitter.com/devopsengineers",
          },
        ],
      },
      {
        name: "GitHub Communities",
        communities: [
          {
            name: "Open Source Projects",
            description: "A community focused on open-source contributions and discussions.",
            link: "https://github.com/open-source",
          },
          {
            name: "GitHub Stars",
            description: "A space to discover and share trending GitHub repositories.",
            link: "https://github.com/stars",
          },
        ],
      },
      {
        name: "Slack Communities",
        communities: [
          {
            name: "Design & Code",
            description: "A Slack community for designers and developers to collaborate.",
            link: "https://slack.com/design-code",
          },
          {
            name: "Startup Founders",
            description: "A community for startup founders to network and share ideas.",
            link: "https://slack.com/startup-founders",
          },
        ],
      },
    ],
  };

  const filteredPlatforms =
    activeFilter === "all"
      ? communityData.platforms
      : communityData.platforms.filter((platform) => platform.name.toLowerCase().includes(activeFilter));

  return (
    <div className="min-h-screen bg-white text-gray-900 mb-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
            Developer Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join vibrant developer communities across various platforms to learn, share, and grow
            together. Find your tribe and start collaborating today!
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("discord")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "discord"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Discord
          </button>
          <button
            onClick={() => setActiveFilter("reddit")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "reddit"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Reddit
          </button>
          <button
            onClick={() => setActiveFilter("twitter")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "twitter"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => setActiveFilter("github")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "github"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            GitHub
          </button>
          <button
            onClick={() => setActiveFilter("slack")}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === "slack"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Slack
          </button>
        </div>

        {/* Community Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-purple-500 mb-4">
                {platform.name}
              </h2>

              <div className="space-y-4">
                {platform.communities.map((community, communityIndex) => (
                  <div
                    key={communityIndex}
                    className="border-b border-gray-700 pb-4 last:border-b-0"
                  >
                    <h3 className="font-semibold text-lg text-white">
                      {community.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base mb-2">
                      {community.description}
                    </p>
                    <a
                      href={community.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-purple-500 hover:text-purple-400 transition-all duration-200 hover:underline text-sm md:text-base"
                    >
                      Join Community →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;