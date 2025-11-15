import { useState } from "react";
import { db, ref, push, set } from "../../db/Firebase/firebase.js";
import { Camera, Link2, Smile, Image, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [postData, setPostData] = useState({
    name: "",
    phone: "",
    postName: "",
    postContent: "",
    imageUrl: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    if (name === "postContent") {
      setCharCount(value.length);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postData.postContent.length > 500) {
      setError("Post content cannot exceed 500 characters.");
      return;
    }
    if (!postData.name || !postData.phone || !postData.postName || !postData.postContent) {
      setError("All fields are required.");
      return;
    }

    const postRef = push(ref(db, "posts"));
    set(postRef, {
      ...postData,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
    });
    setPostData({ name: "", phone: "", postName: "", postContent: "", imageUrl: "" });
    setCharCount(0);
    setError("");
  };

  const clearImage = () => {
    setPostData({ ...postData, imageUrl: "" });
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12">
      <div className="max-w-2xl w-full mx-4 bg-gray-800 text-white rounded-xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-50">Create a Post</h2>
          <p className="text-gray-100 mt-2">Share your thoughts with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={postData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={postData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            />

            <input
              type="text"
              name="postName"
              placeholder="Give your post a title"
              value={postData.postName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
            />

            <div className="relative">
              <textarea
                name="postContent"
                placeholder="Write your post content here..."
                value={postData.postContent}
                onChange={handleChange}
                required
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors min-h-[150px] resize-none"
              />
              <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                {charCount}/500
              </span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-colors cursor-pointer">
                <Camera size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="imageUrl"
                placeholder="Or paste image URL"
                value={postData.imageUrl}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              />
            </div>

            {postData.imageUrl && (
              <div className="relative inline-block">
                <img
                  src={postData.imageUrl}
                  alt="Post preview"
                  className="max-h-48 rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full text-white hover:bg-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                title="Add link"
              >
                <Link2 size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                title="Add emoji"
              >
                <Smile size={20} />
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;