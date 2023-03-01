import { Link } from "react-router-dom";
import "./Button.css";

const Button = (props) => {
  let style = "";

  switch (props.kind) {
    case "warning":
      style +=
        "text-md rounded-lg border border-red-500 hover:bg-red-50 px-5 py-2 text-center font-light text-red-500 focus:outline-none";
      break;
    case "post":
      style +=
        "text-md rounded-lg border border-green-400 hover:bg-green-50 px-5 py-2 text-center font-light text-green-500 focus:outline-none";
      break;
    case "lowkey":
      style +=
        "text-gray-500 hover:text-cyan-500 text-center italic hover:bg-gray-50 focus:outline-none font-light rounded-lg text-md py-2 px-5";
      break;
    case "lowkey_pxless":
      style +=
        "text-gray-500 hover:text-cyan-500 text-center italic hover:bg-gray-50 focus:outline-none font-light rounded-lg text-md py-2 px-1";
      break;
    default:
      style +=
        " border text-cyan-500 hover:bg-cyan-50 focus:outline-none font-light rounded-lg text-md px-5 py-2 text-center ring-cyan-400 border-cyan-400";
  }

  // <Link> Button
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact || true} className={`${style}`}>
        {props.children}
      </Link>
    );
  }
  // Special button that has dedicated onClick()
  else {
    return (
      <button
        onClick={props.onClick}
        disabled={props.disabled}
        className={`${props.className} ` + style}
        data-testid={props.testid}
      >
        {props.children}
      </button>
    );
  }
};

export default Button;
