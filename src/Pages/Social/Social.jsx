import { useEffect, useState, useCallback } from "react";
import { db, ref, onValue, update, get, set } from "../../db/Firebase/firebase.js";
import { Link, useNavigate } from "react-router-dom";

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 5;

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load posts from Firebase with pagination
  useEffect(() => {
    setIsLoading(true);
    const postsRef = ref(db, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
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

    return () => unsubscribe();
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
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, posts, bookmarkedPosts]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    setDisplayedPosts(filteredPosts.slice(0, endIndex));

    // Animate new posts
    const newPosts = filteredPosts.slice(startIndex, endIndex);
    const newAnimatedPosts = { ...animatedPosts };
    newPosts.forEach((post, index) => {
      setTimeout(() => {
        newAnimatedPosts[post.id] = true;
        setAnimatedPosts({ ...newAnimatedPosts });
      }, index * 100);
    });
  }, [filteredPosts, currentPage]);

  const loadMorePosts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const hasMorePosts = displayedPosts.length < filteredPosts.length;

  const formatTimeAgo = useCallback((timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';

    return Math.floor(seconds) + 's';
  }, []);

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
        userName: "You",
        userAvatar: "Y"
      }
    ];

    await update(postRef, { comments: updatedComments });
    setComment("");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.postName.trim() || !newPost.postContent.trim()) return;

    const newPostId = `post-${Date.now()}`;
    const postData = {
      ...newPost,
      name: "Your Username",
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    await set(ref(db, `posts/${newPostId}`), postData);
    setNewPost({ postName: "", postContent: "", imageUrl: "" });
    setShowNewPostForm(false);
  };

  // Mobile responsiveness helper
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Back to Home Button */}
      {/* <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </button> */}

      {/* Floating Action Button for Mobile */}
      <Link to="/addpost">
        <button
          className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </Link>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl transform transition-transform duration-300 lg:hidden ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
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
            {["trending", "newest", "mostComments", "suggested", "bookmarked"].map((filter) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setShowMobileMenu(false); }}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center space-x-3 ${activeFilter === filter
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                  : `${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"}`
                  }`}
              >
                <span className="text-lg">
                  {filter === "trending" && "🔥"}
                  {filter === "newest" && "🆕"}
                  {filter === "mostComments" && "💬"}
                  {filter === "suggested" && "🎯"}
                  {filter === "bookmarked" && "📌"}
                </span>
                <span className="capitalize">
                  {filter === "mostComments" ? "Most Comments" :
                    filter === "bookmarked" ? "Bookmarked" :
                      `${filter} Posts`}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full px-4 py-3 rounded-xl text-left transition-colors duration-200 flex items-center space-x-3 ${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-800"
                }`}
            >
              <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-4 px-4 md:py-8">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowMobileMenu(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                CHRONO
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Where tech visionaries connect</p>
            </div>
          </div>

          {/* Navigation Buttons - Center */}
          <div className="hidden lg:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/code">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Code</span>
              </button>
            </Link>
            <Link to="/community">
              <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Community</span>
              </button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:scale-110 transition-transform duration-200"
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
            <Link to="/addpost">
              <button
                className="hidden lg:flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Post
              </button>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Buttons */}
        <div className="lg:hidden flex justify-center space-x-4 mb-6">
          <Link to="/code" className="flex-1 max-w-[140px]">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Code</span>
            </button>
          </Link>
          <Link to="/community" className="flex-1 max-w-[140px]">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Community</span>
            </button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 px-6 py-8 md:py-12 md:px-10 lg:px-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Transform Your Tech Journey with CHRONO
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
          {["trending", "newest", "mostComments", "suggested", "bookmarked"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${activeFilter === filter
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                : `${darkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
                }`}
            >
              <span>
                {filter === "trending" && "🔥"}
                {filter === "newest" && "🆕"}
                {filter === "mostComments" && "💬"}
                {filter === "suggested" && "🎯"}
                {filter === "bookmarked" && "📌"}
              </span>
              <span className="capitalize">
                {filter === "mostComments" ? "Most Comments" :
                  filter === "bookmarked" ? "Bookmarked" :
                    `${filter} Posts`}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Filter Tabs (scrollable) */}
        <div className="lg:hidden overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {["trending", "newest", "mostComments", "suggested", "bookmarked"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${activeFilter === filter
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                  : `${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`
                  }`}
              >
                <span>
                  {filter === "trending" && "🔥"}
                  {filter === "newest" && "🆕"}
                  {filter === "mostComments" && "💬"}
                  {filter === "suggested" && "🎯"}
                  {filter === "bookmarked" && "📌"}
                </span>
                <span className="capitalize">
                  {filter === "trending" && "Trending"}
                  {filter === "newest" && "Newest"}
                  {filter === "mostComments" && "Comments"}
                  {filter === "suggested" && "For You"}
                  {filter === "bookmarked" && "Saved"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-6">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 animate-pulse`}>
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
                    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl mt-4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className={`text-center p-12 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-2xl shadow-lg`}>
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
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {activeFilter === "bookmarked" ? "Explore Trending Posts" : "Create the First Post"}
                </button>
              </div>
            )}

            {/* Posts Grid */}
            <div className="space-y-6">
              {displayedPosts.map(({ id, name, postName, postContent, imageUrl, timestamp, likes, comments = [] }) => (
                <div
                  key={id}
                  className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform ${animatedPosts[id] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {name ? name[0] : 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{name || "Anonymous User"}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(timestamp)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookmark(id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 ${bookmarkedPosts[id] ? 'fill-current text-blue-500' : 'stroke-current text-gray-400'}`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {postName}
                    </h2>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line leading-relaxed">
                      {postContent}
                    </p>
                    {imageUrl && (
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <img
                          src={imageUrl}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover transform hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Post Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Tech", "Programming", "WebDev", "Innovation"].slice(0, Math.floor(Math.random() * 3) + 1).map((tag, index) => (
                        <span key={index} className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Stats */}
                  <div className={`px-6 py-3 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} flex items-center justify-between text-sm`}>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <span className="font-semibold">{likes || 0}</span>
                        <span>likes</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <span className="font-semibold">{comments.length || 0}</span>
                        <span>comments</span>
                      </span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between border-t border-gray-100 dark:border-gray-700`}>
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => handleLike(id, likes)}
                        disabled={likedPosts[id]}
                        className={`flex items-center space-x-2 flex-1 justify-center py-2 rounded-xl transition-all duration-200
                          ${likedPosts[id]
                            ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500'
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
                        <span className="font-medium">Like</span>
                      </button>

                      <button
                        onClick={() => setSelectedPost(selectedPost === id ? null : id)}
                        className={`flex items-center space-x-2 flex-1 justify-center py-2 rounded-xl transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">Comment</span>
                      </button>

                      <button className={`flex items-center space-x-2 flex-1 justify-center py-2 rounded-xl transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === id && (
                    <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="space-y-4 mb-4">
                        {comments && comments.length > 0 ? (
                          comments.map((comment, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold`}>
                                  {comment.userAvatar || 'U'}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="bg-white dark:bg-gray-700 rounded-2xl p-3">
                                  <div className="flex items-center mb-1">
                                    <span className="font-semibold text-sm mr-2">{comment.userName || 'User'}</span>
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

                      {/* Comment Input */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold`}>
                            Y
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
                            rows="2"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleComment(id)}
                              disabled={!comment.trim()}
                              className={`px-4 py-2 rounded-xl transition-all duration-200 ${comment.trim()
                                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl'
                                : darkMode
                                  ? 'bg-gray-600 text-gray-400'
                                  : 'bg-gray-300 text-gray-500'
                                }`}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!isLoading && hasMorePosts && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Side Content */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Resources Card */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">
                📚 Educational Resources
              </h2>
              <div className="space-y-4">
                <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <p>Check out our latest educational resources and tutorials to enhance your knowledge.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Advanced React Patterns", time: "15 min read", icon: "⚛️", color: "from-blue-500 to-purple-600" },
                    { title: "Modern CSS Tricks", time: "8 min read", icon: "🎨", color: "from-green-500 to-teal-600" },
                    { title: "JavaScript Performance Tips", time: "12 min read", icon: "⚡", color: "from-yellow-500 to-orange-600" }
                  ].map((resource, index) => (
                    <div key={index} className={`p-3 rounded-xl flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-all duration-200 hover:scale-105`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} text-white flex items-center justify-center mr-3 text-lg`}>
                        {resource.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{resource.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{resource.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Explore Resources
                </button>
              </div>
            </div>

            {/* Community Highlights */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-lg p-6`}>
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
                    <div key={index} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:scale-105 transition-transform duration-200`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mr-3 font-semibold">
                          {member.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{member.name}</h3>
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
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  View All Members
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-lg p-6`}>
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
                  <div key={index} className={`px-4 py-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-all duration-200 hover:scale-105`}>
                    <span className="text-sm font-semibold">{item.topic}</span>
                    <span className={`text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} px-2 py-1 rounded-full font-medium`}>{item.posts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Social;