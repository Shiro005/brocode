import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, Search } from 'lucide-react';
import { db, ref, onValue, query, orderByChild, startAt, endAt } from '../../db/Firebase/firebase.js';

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newPostCount, setNewPostCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState([]);

  // Fetch new posts for notifications
  useEffect(() => {
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newPosts = Object.entries(data)
          .map(([id, post]) => ({ id, ...post }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(newPosts);

        // Filter unseen notifications
        const unseen = newPosts.filter((post) => !post.seen);
        setUnseenNotifications(unseen);
        setNewPostCount(unseen.length);
      }
    });
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const postsRef = ref(db, 'posts');
      const searchQueryLower = searchQuery.toLowerCase();

      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const results = Object.entries(data)
            .map(([id, post]) => ({ id, ...post }))
            .filter(
              (post) =>
                post.postName.toLowerCase().includes(searchQueryLower) ||
                post.name.toLowerCase().includes(searchQueryLower)
            );

          setSearchResults(results);
        }
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Mark notification as seen when clicked
  const handleNotificationClick = (postId) => {
    const updatedNotifications = notifications.map((post) =>
      post.id === postId ? { ...post, seen: true } : post
    );
    setNotifications(updatedNotifications);

    const updatedUnseen = unseenNotifications.filter((post) => post.id !== postId);
    setUnseenNotifications(updatedUnseen);
    setNewPostCount(updatedUnseen.length);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-violet-900/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300 hover:from-pink-200 hover:to-violet-200 transition-all duration-300">
              BroCode
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search BroCode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white rounded-full border border-violet-600/50 
                         focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none
                         backdrop-blur-sm transition-all duration-200
                         placeholder:text-gray-400"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg border border-violet-500/30 p-4">
                  {searchResults.map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="block p-2 hover:bg-violet-900/30 rounded-lg transition-colors duration-200"
                    >
                      <p className="text-sm text-gray-200">{post.postName}</p>
                      <p className="text-xs text-gray-400">by {post.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-violet-700/50 transition-all duration-200 text-violet-100 hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-pink-500/20 relative"
            >
              <Bell className="w-6 h-6" />
              {newPostCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {newPostCount}
                </span>
              )}
            </button>
            <Link to="/">
              <button
                className="p-2 rounded-full hover:bg-violet-700/50 transition-all duration-200 text-violet-100 hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </Link>
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="md:hidden p-2 rounded-full hover:bg-violet-700/50 transition-all duration-200 text-violet-100 hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Slides down when search is clicked */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isSearchVisible ? 'max-h-20 opacity-100 py-3' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="relative w-full group">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search BroCode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white rounded-full border border-violet-600/50 
                       focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none
                       backdrop-blur-sm transition-all duration-200
                       placeholder:text-gray-400"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg border border-violet-500/30 p-4">
                {searchResults.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block p-2 hover:bg-violet-900/30 rounded-lg transition-colors duration-200"
                  >
                    <p className="text-sm text-gray-200">{post.postName}</p>
                    <p className="text-xs text-gray-400">by {post.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
       <div className="absolute top-full right-4 mt-2 w-80 bg-gray-900/80 backdrop-blur-lg rounded-lg shadow-lg border border-violet-500/20 p-4 flex flex-col h-96 overflow-y-auto">
       {/* Glass effect and scrollbar styling */}
       <style>
         {`
           .scrollbar-hide::-webkit-scrollbar {
             display: none;
           }
           .scrollbar-hide {
             -ms-overflow-style: none; /* IE and Edge */
             scrollbar-width: none; /* Firefox */
           }
         `}
       </style>
     
       {/* Notification Panel Content */}
       <div className="scrollbar-hide overflow-y-auto">
         <h3 className="text-lg font-semibold text-white mb-3">Notifications</h3>
         <div className="space-y-3">
           {unseenNotifications.map((post) => (
             <Link
               key={post.id}
               to={`/post/${post.id}`}
               onClick={() => handleNotificationClick(post.id)}
               className="block p-3 hover:bg-violet-900/30 rounded-lg transition-colors duration-200 backdrop-blur-sm bg-gray-800/50 border border-violet-500/10"
             >
               <p className="text-sm text-gray-200">New post: {post.postName}</p>
               <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(post.timestamp)}</p>
             </Link>
           ))}
         </div>
       </div>
     </div>
      )}
    </nav>
  );
};

// Helper function to format time ago
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

export default Header;