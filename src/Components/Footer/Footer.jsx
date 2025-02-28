import React, { useState } from "react";
import { 
  Home,
  PlusSquare,
  Users,
  Code,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [activeTab, setActiveTab] = useState("/");

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      customStyles: "stroke-[1.5px]"
    },
    // {
    //   icon: PlusSquare,
    //   label: "Create",
    //   path: "/addpost",
    //   customStyles: "stroke-[1.5px]"
    // },
    {
      icon: Users,
      label: "Community",
      path: "/community",
      customStyles: "stroke-[1.5px]"
    },
    {
      icon: Code,
      label: "Code",
      path: "/code",
      customStyles: "stroke-[1.5px]"
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe-area">
      <div className="max-w-lg mx-auto px-4">
        <nav className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setActiveTab(item.path)}
              className="relative group"
            >
              {/* Active Tab Indicator */}
              {activeTab === item.path && (
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
              )}

              {/* Icon and Label Container */}
              <div className="flex flex-col items-center space-y-1">
                {/* Icon with Dynamic Styling */}
                <div className={`
                  relative p-2 rounded-xl transition-all duration-200
                  ${activeTab === item.path 
                    ? 'text-pink-500 dark:text-pink-400 scale-110' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'
                  }
                  group-hover:bg-gray-100 dark:group-hover:bg-gray-800
                `}>
                  <item.icon 
                    className={`w-6 h-6 transition-transform duration-200 ${item.customStyles}
                      ${activeTab === item.path 
                        ? 'transform scale-105' 
                        : 'group-hover:scale-105'
                      }
                    `}
                  />
                  
                  {/* Special Effect for Active Icon */}
                  {activeTab === item.path && (
                    <span className="absolute inset-0 rounded-xl bg-blue-100 dark:bg-pink-900 opacity-20 animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs font-medium transition-all duration-200
                  ${activeTab === item.path 
                    ? 'text-pink-500 dark:text-pink-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {/* {item.label} */}
                </span>
              </div>

              {/* Hover Effect */}
              <span className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2 
                w-full h-0.5 rounded-t-full transition-all duration-200
                ${activeTab === item.path 
                  ? 'bg-pink-500 opacity-100' 
                  : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                }
              `} />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;