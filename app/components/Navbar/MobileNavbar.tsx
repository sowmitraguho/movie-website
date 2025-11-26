'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Home, Film, Tv, Star, TrendingUp, Search, User, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  gradient: string;
  iconColor: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Home",
    href: "#",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: <Film className="h-5 w-5" />,
    label: "Movies",
    href: "#",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    icon: <Tv className="h-5 w-5" />,
    label: "TV Shows",
    href: "#",
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: "Trending",
    href: "#",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "Top Rated",
    href: "#",
    gradient: "radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(202,138,4,0.06) 50%, rgba(161,98,7,0) 100%)",
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
];

const menuVariants: Variants = {
  hidden: { 
    x: '100%',
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const itemVariants: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  })
};

function MobileNavbar(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <motion.nav
        className="p-3 rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-lg border border-gray-200/80 dark:border-gray-800/80 shadow-lg dark:shadow-gray-900/20 relative overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileTap={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Film className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              CineMax
            </span>
          </motion.a>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            <motion.button
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            {!isLoggedIn ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-lg text-sm"
                >
                  Login
                </Button>
              </motion.div>
            ) : (
              <motion.button
                onClick={toggleMenu}
                className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <User className="h-5 w-5 text-white" />
              </motion.button>
            )}

            <motion.button
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    CineMax
                  </span>
                </div>
                <motion.button
                  onClick={closeMenu}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Search Bar in Menu */}
              <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Search className="h-4 w-4 ml-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-full"
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <nav className="space-y-2">
                {menuItems.map((item: MenuItem, index: number) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    onClick={closeMenu}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div
                        className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: item.gradient }}
                      />
                      <span className={`relative ${item.iconColor}`}>
                        {item.icon}
                      </span>
                    </motion.div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* User Section */}
              {isLoggedIn && (
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href="#"
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    onClick={closeMenu}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNavbar;