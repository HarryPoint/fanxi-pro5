import classNames from "classnames";

const Icon = (props) => {
  const { type, style, className } = props;
  return (
    <svg
      className={classNames(["icon", className])}
      aria-hidden="true"
      style={style}
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
};

export default Icon;
