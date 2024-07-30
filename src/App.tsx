import { useState, useEffect } from "react";
import { getQueryParam, updateQueryParam } from "./utils";
import Header from "./components/Header";
import List from "./components/List";

function App() {
  const languages = ["all", "javascript", "ruby", "java", "css", "python"];
  const getLanguage = () => {
    const language = getQueryParam("language");
    if (language && languages.includes(language)) {
      return language;
    }
    return languages[0];
  };
  const [language, setLanguage] = useState(getLanguage());
  useEffect(() => {
    updateQueryParam("language", language);
  }, [language]);
  return (
    <div>
      <Header
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
      {languages.map((item) => (
        <List key={item} language={item} show={language === item} />
      ))}
    </div>
  );
}

export default App;
