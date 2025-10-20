import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from './api/userService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang || "en";
  });
  const [user, setUser] = useState(null);
  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language, i18n]);
  
  useEffect(() => {
    userService.getCurrentUser("/session-user") 
      .then(res => {
        if (res.data.success) setUser(res.data.user);
      })
      .catch(err => console.error(err));
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "lt" : "en"));

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// --- Custom Hook ---
export const useAppContext = () => useContext(AppContext);
