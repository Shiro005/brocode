import { useEffect, useState } from "react";
import { db, ref, onValue, update, get } from "../../db/Firebase/firebase.js";

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [activeFilter, setActiveFilter] = useState("trending"); // Default filter

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.entries(data)
          .map(([id, post]) => ({ id, ...post }))
          .sort((a, b) => (b.likes || 0) - (a.likes || 0)); // Default: Trending
        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts); // Initialize filtered posts
      }
    });
  }, []);

  // Apply filter logic
  useEffect(() => {
    let sortedPosts = [...posts];
    switch (activeFilter) {
      case "trending":
        sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "newest":
        sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "mostComments":
        sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      case "suggested":
        // Suggested posts logic (e.g., based on user interests or random)
        sortedPosts = sortedPosts.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    setFilteredPosts(sortedPosts);
  }, [activeFilter, posts]);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const handleLike = async (id, likes) => {
    if (likedPosts[id]) return;

    const newLikedPosts = { ...likedPosts, [id]: true };
    setLikedPosts(newLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
    
    await update(ref(db, `posts/${id}`), { likes: (likes || 0) + 1 });
  };

  const handleComment = async (id) => {
    if (!comment.trim()) return;

    const postRef = ref(db, `posts/${id}`);
    const snapshot = await get(postRef);
    const post = snapshot.val();
    const updatedComments = [...(post.comments || []), { text: comment, timestamp: new Date().toISOString() }];
    
    await update(postRef, { comments: updatedComments });
    setComment("");
  };

  return (
    <div className="min-h-screen bg-gray-100 mb-12">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
        Welcome to the ultimate educational social hub—designed & developed by the WebReich OGs, <span className="text-amber-600"> Shriyash & Akshay</span>
        </h1>
        <p className="text-gray-800 mb-8 text-md">
        Connect, vibe, drop knowledge bombs, and level up together. No boring lectures—just pure Gen Z wisdom & chaos in one place! 🤯🔥 #StayCurious #LearnLikeABoss"
        </p>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveFilter("trending")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              activeFilter === "trending"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🔥 Trending Posts
          </button>
          <button
            onClick={() => setActiveFilter("newest")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              activeFilter === "newest"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🆕 Newest Posts
          </button>
          <button
            onClick={() => setActiveFilter("mostComments")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              activeFilter === "mostComments"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            💬 Most Comments
          </button>
          <button
            onClick={() => setActiveFilter("suggested")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              activeFilter === "suggested"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🎯 Suggested for You
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="grid gap-6">
              {filteredPosts.map(({ id, name, postName, postContent, imageUrl, timestamp, likes, comments }) => (
                <div 
                  key={id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">
                      {postName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTimeAgo(timestamp)}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 mb-4 whitespace-pre-line">
                      {postContent}
                    </p>
                    {imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={imageUrl} 
                          alt="Post content" 
                          className="rounded-lg w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Footer */}
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(id, likes)}
                        disabled={likedPosts[id]}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200
                          ${likedPosts[id] 
                            ? 'bg-pink-100 text-pink-500' 
                            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        <svg 
                          className={`w-5 h-5 ${likedPosts[id] ? 'fill-current' : 'stroke-current fill-none'}`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>{likes || 0}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-500">
                      <button 
                        onClick={() => setSelectedPost(selectedPost === id ? null : id)}
                        className="hover:bg-gray-200 p-2 rounded-full transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </button>
                      <button className="hover:bg-gray-200 p-2 rounded-full transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === id && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="space-y-4">
                        {comments && comments.map((comment, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-1">
                              <div className="text-sm text-gray-700">{comment.text}</div>
                              <div className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                        <button
                          onClick={() => handleComment(id)}
                          className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side Content */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                📚 Educational Resources
              </h2>
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p>Check out our latest educational resources and tutorials to enhance your knowledge.</p>
                </div>
                <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200">
                  Explore Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;