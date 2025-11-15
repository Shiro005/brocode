import { useEffect, useState } from "react";
import { db, ref, onValue, update, get, set } from "../../db/Firebase/firebase.js";

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [activeFilter, setActiveFilter] = useState("trending");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ postName: "", postContent: "", imageUrl: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [animatedPosts, setAnimatedPosts] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
    const saved = localStorage.getItem('bookmarkedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load posts from Firebase
  useEffect(() => {
    setIsLoading(true);
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.entries(data)
          .map(([id, post]) => ({ id, ...post }))
          .sort((a, b) => (b.likes || 0) - (a.likes || 0));
        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts);
      }
      setIsLoading(false);
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
        sortedPosts = sortedPosts.sort(() => Math.random() - 0.5);
        break;
      case "bookmarked":
        sortedPosts = sortedPosts.filter(post => bookmarkedPosts[post.id]);
        break;
      default:
        break;
    }
    setFilteredPosts(sortedPosts);
  }, [activeFilter, posts, bookmarkedPosts]);

  // Handle animation when posts load
  useEffect(() => {
    if (!isLoading && filteredPosts.length > 0) {
      const newAnimatedPosts = {};
      filteredPosts.forEach((post, index) => {
        setTimeout(() => {
          setAnimatedPosts(prev => ({ ...prev, [post.id]: true }));
        }, index * 100);
      });
    }
  }, [filteredPosts, isLoading]);

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

  const handleBookmark = (id) => {
    const newBookmarkedPosts = {
      ...bookmarkedPosts,
      [id]: !bookmarkedPosts[id]
    };

    setBookmarkedPosts(newBookmarkedPosts);
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarkedPosts));
  };

  const handleComment = async (id) => {
    if (!comment.trim()) return;

    const postRef = ref(db, `posts/${id}`);
    const snapshot = await get(postRef);
    const post = snapshot.val();
    const updatedComments = [
      ...(post.comments || []),
      {
        text: comment,
        timestamp: new Date().toISOString(),
        userName: "You" // In a real app, this would be the actual user's name
      }
    ];

    await update(postRef, { comments: updatedComments });
    setComment("");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.postName.trim() || !newPost.postContent.trim()) return;

    const postsRef = ref(db, "posts");
    const snapshot = await get(postsRef);
    const postsData = snapshot.val() || {};

    const newPostId = `post-${Date.now()}`;
    const postData = {
      ...newPost,
      name: "Your Username", // In a real app, this would be the actual user's name
      timestamp: new Date().toISOString(),
      likes: 0
    };

    await set(ref(db, `posts/${newPostId}`), postData);
    setNewPost({ postName: "", postContent: "", imageUrl: "" });
    setShowNewPostForm(false);
  };

  // Mobile responsiveness helper
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} mb-12`}>
      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setShowNewPostForm(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform transition-transform duration-300 lg:hidden ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              CHRONO
            </h2>
            <button onClick={() => setShowMobileMenu(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setActiveFilter("trending"); setShowMobileMenu(false); }}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${activeFilter === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}`}
            >
              🔥 Trending Posts
            </button>
            <button
              onClick={() => { setActiveFilter("newest"); setShowMobileMenu(false); }}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${activeFilter === "newest"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}`}
            >
              🆕 Newest Posts
            </button>
            <button
              onClick={() => { setActiveFilter("mostComments"); setShowMobileMenu(false); }}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${activeFilter === "mostComments"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}`}
            >
              💬 Most Comments
            </button>
            <button
              onClick={() => { setActiveFilter("suggested"); setShowMobileMenu(false); }}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${activeFilter === "suggested"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}`}
            >
              🎯 Suggested for You
            </button>
            <button
              onClick={() => { setActiveFilter("bookmarked"); setShowMobileMenu(false); }}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${activeFilter === "bookmarked"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}`}
            >
              📌 Bookmarked
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-4 px-4 md:py-8">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-200"
              onClick={() => setShowMobileMenu(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                WebReich
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Where tech visionaries connect</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="hidden lg:flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Post
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 px-6 py-8 md:py-12 md:px-10 lg:px-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Transform Your Tech Journey with WebReich
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mb-6">
              Code with cutting edge technologies, build real-world projects, and connect with a vibrant tech community. No boring lectures—just pure Gen Z wisdom & chaos in one place! 🤯🔥
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">#StayCurious</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">#LearnLikeABoss</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">#CodeRevolution</span>
            </div>
          </div>
        </div>

        {/* Filter Options (desktop) */}
        <div className="hidden lg:flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveFilter("trending")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${activeFilter === "trending"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
              }`}
          >
            🔥 Trending Posts
          </button>
          <button
            onClick={() => setActiveFilter("newest")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${activeFilter === "newest"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
              }`}
          >
            🆕 Newest Posts
          </button>
          <button
            onClick={() => setActiveFilter("mostComments")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${activeFilter === "mostComments"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
              }`}
          >
            💬 Most Comments
          </button>
          <button
            onClick={() => setActiveFilter("suggested")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${activeFilter === "suggested"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
              }`}
          >
            🎯 Suggested for You
          </button>
          <button
            onClick={() => setActiveFilter("bookmarked")}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${activeFilter === "bookmarked"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
              }`}
          >
            📌 Bookmarked
          </button>
        </div>

        {/* Mobile Filter Tabs (scrollable) */}
        <div className="lg:hidden overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setActiveFilter("trending")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setActiveFilter("newest")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === "newest"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                }`}
            >
              🆕 Newest
            </button>
            <button
              onClick={() => setActiveFilter("mostComments")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === "mostComments"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                }`}
            >
              💬 Comments
            </button>
            <button
              onClick={() => setActiveFilter("suggested")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === "suggested"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                }`}
            >
              🎯 For You
            </button>
            <button
              onClick={() => setActiveFilter("bookmarked")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === "bookmarked"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                }`}
            >
              📌 Saved
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-6">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 animate-pulse`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className={`text-center p-12 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {activeFilter === "bookmarked"
                    ? "You haven't bookmarked any posts yet."
                    : "There are no posts matching your filter criteria."}
                </p>
                <button
                  onClick={() => activeFilter === "bookmarked" ? setActiveFilter("trending") : setShowNewPostForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg"
                >
                  {activeFilter === "bookmarked" ? "Explore Trending Posts" : "Create the First Post"}
                </button>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid gap-6">
              {filteredPosts.map(({ id, name, postName, postContent, imageUrl, timestamp, likes, comments = [] }) => (
                <div
                  key={id}
                  className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform ${animatedPosts[id] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-1">
                      {postName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTimeAgo(timestamp)}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line">
                      {postContent}
                    </p>
                    {imageUrl && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={imageUrl}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Post Tags (simulated) */}
                    {Math.random() > 0.5 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["JavaScript", "React", "WebDev", "Frontend"].slice(0, Math.floor(Math.random() * 3) + 1).map((tag, index) => (
                          <span key={index} className={`px-2 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Stats */}
                  <div className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} flex items-center text-sm`}>
                    <div className="flex items-center space-x-4">
                      <span>{likes || 0} likes</span>
                      <span>•</span>
                      <span>{comments.length || 0} comments</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between border-t border-gray-100 dark:border-gray-700`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(id, likes)}
                        disabled={likedPosts[id]}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200
                          ${likedPosts[id]
                            ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500'
                            : `${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`
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
                        <span>Like</span>
                      </button>

                      <button
                        onClick={() => setSelectedPost(selectedPost === id ? null : id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>Comment</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmark(id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200
                          ${bookmarkedPosts[id]
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500'
                            : `${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`
                          }`}
                      >
                        <svg className={`w-5 h-5 ${bookmarkedPosts[id] ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <span>Save</span>
                      </button>

                      <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === id && (
                    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="space-y-4">
                        {comments && comments.length > 0 ? (
                          comments.map((comment, index) => (
                            <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                  <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                                    <span className="text-xs font-medium">{comment.userName ? comment.userName[0] : 'U'}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <span className="font-medium mr-2">{comment.userName || 'User'}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(comment.timestamp)}</span>
                                  </div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{comment.text}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500 dark:text-gray-400">Be the first to comment on this post!</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className={`flex items-start space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3`}>
                          <div className="flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                              <span className="text-xs font-medium">Y</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment..."
                              className={`w-full p-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              rows="2"
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => handleComment(id)}
                                disabled={!comment.trim()}
                                className={`px-4 py-2 ${comment.trim() ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} rounded-lg transition-colors duration-200`}
                              >
                                Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side Content */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Resources Card */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-md p-6`}>
              <h2 className="text-xl font-semibold mb-4">
                📚 Educational Resources
              </h2>
              <div className="space-y-4">
                <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <p>Check out our latest educational resources and tutorials to enhance your knowledge.</p>
                </div>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-colors duration-200`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Advanced React Patterns</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">15 min read</p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-colors duration-200`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Modern CSS Tricks</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">8 min read</p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-colors duration-200`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">JavaScript Performance Tips</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">12 min read</p>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-md transition-shadow duration-200">
                  Explore Resources
                </button>
              </div>
            </div>

            {/* Community Highlights */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-md p-6`}>
              <h2 className="text-xl font-semibold mb-4">
                👥 Community Highlights
              </h2>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Alex Chen", points: 1250, badge: "🏆 Top Contributor" },
                    { name: "Jamie Smith", points: 980, badge: "🚀 Rising Star" },
                    { name: "Taylor Kim", points: 830, badge: "🔥 Knowledge Guru" }
                  ].map((member, index) => (
                    <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mr-3">
                          <span className="font-medium">{member.name[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{member.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{member.points} points</span>
                            <span className="mx-1">•</span>
                            <span className="text-xs text-purple-500">{member.badge}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-md transition-shadow duration-200">
                  View All Members
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-md p-6`}>
              <h2 className="text-xl font-semibold mb-4">
                🔥 Trending Topics
              </h2>
              <div className="space-y-3">
                {[
                  { topic: "React Hooks Best Practices", posts: 34 },
                  { topic: "TailwindCSS vs Bootstrap", posts: 28 },
                  { topic: "JavaScript ES2023 Features", posts: 21 },
                  { topic: "Web Performance Optimization", posts: 19 },
                  { topic: "Frontend Architecture Patterns", posts: 15 }
                ].map((item, index) => (
                  <div key={index} className={`px-4 py-2 rounded-lg flex items-center justify-between ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-colors duration-200`}>
                    <span className="text-sm font-medium">{item.topic}</span>
                    <span className={`text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} px-2 py-1 rounded-full`}>{item.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-xl overflow-hidden`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label htmlFor="postName" className="block text-sm font-medium mb-1">Post Title</label>
                  <input
                    type="text"
                    id="postName"
                    value={newPost.postName}
                    onChange={(e) => setNewPost({ ...newPost, postName: e.target.value })}
                    placeholder="Enter a title for your post"
                    className={`w-full p-2 border rounded-lg ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postContent" className="block text-sm font-medium mb-1">Post Content</label>
                  <textarea
                    id="postContent"
                    value={newPost.postContent}
                    onChange={(e) => setNewPost({ ...newPost, postContent: e.target.value })}
                    placeholder="What would you like to share?"
                    className={`w-full p-3 border rounded-lg ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    rows="6"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={newPost.imageUrl}
                    onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full p-2 border rounded-lg ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                  />
                </div>

                <div className="flex items-center pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    Publish Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className={`ml-4 px-6 py-2 border ${darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      } rounded-lg transition-colors duration-200`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;