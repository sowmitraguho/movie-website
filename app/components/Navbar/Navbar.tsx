'use client'
import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Home, Film, Tv, Star, TrendingUp, Search, User, LogOut, UserCircle } from 'lucide-react';
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
    iconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
  },
  {
    icon: <Film className="h-5 w-5" />,
    label: "Movies",
    href: "#",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
  },
  {
    icon: <Tv className="h-5 w-5" />,
    label: "TV Shows",
    href: "#",
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: "Trending",
    href: "#",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "Top Rated",
    href: "#",
    gradient: "radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(202,138,4,0.06) 50%, rgba(161,98,7,0) 100%)",
    iconColor: "group-hover:text-yellow-500 dark:group-hover:text-yellow-400",
  },
];

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

function Navbar(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
  };

  return (
    <motion.nav
      className="p-3 rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-lg border border-gray-200/80 dark:border-gray-800/80 shadow-lg dark:shadow-gray-900/20 relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 50%, rgba(239,68,68,0.1) 100%)"
        }}
        variants={navGlowVariants}
      />
      
      <div className="flex items-center justify-between gap-6 relative z-10">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Film className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            CineMax
          </span>
        </motion.a>

        {/* Menu Items */}
        <ul className="flex items-center gap-1">
          {menuItems.map((item: MenuItem) => (
            <motion.li key={item.label} className="relative">
              <motion.div
                className="block rounded-xl overflow-visible group relative"
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                  variants={glowVariants}
                  style={{
                    background: item.gradient,
                    opacity: 0,
                  }}
                />
                <motion.a
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 relative z-10 bg-transparent text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors rounded-xl"
                  variants={itemVariants}
                  transition={sharedTransition}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom"
                  }}
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.a>
                <motion.a
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 absolute inset-0 z-10 bg-transparent text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors rounded-xl"
                  variants={backVariants}
                  transition={sharedTransition}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center top",
                    transform: "rotateX(90deg)"
                  }}
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.a>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* Search Bar and Auth */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <motion.div
            className="relative group"
            whileFocus="focus"
            initial="initial"
          >
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative flex items-center bg-white/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <Search className="h-4 w-4 ml-3 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-48"
              />
            </div>
          </motion.div>

          {/* Login/Profile */}
          {!isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-xl shadow-lg"
              >
                Login
              </Button>
            </motion.div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5 text-white" />
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <UserCircle className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;