import classNames from "classnames";

const Header = (props) => {
  const { language, setLanguage, languages } = props;

  return (
    <>
      <h1 className="text-3xl lg:text-5xl text-center">github 热门项目</h1>
      <div className="container mx-auto flex justify-center gap-3">
        {languages.map((item) => (
          <a
            key={item}
            onClick={() => setLanguage(item)}
            className={classNames(
              { "text-red-400": language === item },
              "cursor-pointer"
            )}
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
};

export default Header;
