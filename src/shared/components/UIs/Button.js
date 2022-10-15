// 要透過props來看這個button是要正常顏色，還是要顯示紅色(顯示警告)

import { Link } from "react-router-dom";
import "./Button.css";

// use buttons from flowbite
// https://flowbite.com/docs/components/buttons/

const Button = (props) => {
  let style = "";
  // 待加入：
  // if (props.size) {
  //   style += `size--${props.size} `;
  // } else {
  //   style = +"size--dafault";
  // }

  switch (props.kind) {
    case "warning":
      style +=
        "text-red-400 hover:text-white border border-red-400 hover:bg-red-500 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center ml-2 mr-2 mb-2 ";
      break;
    case "comment":
    case "post":
      style +=
        "text-green-400 hover:text-white border border-green-300 hover:bg-green-400  focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center mr-2 mb-2";
      break;
    default:
      style +=
        "bg-gray-50 border text-cyan-500 hover:text-white hover:bg-cyan-400  focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center mb-2 ring-cyan-400 border-cyan-400";
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
        className={style}
      >
        {/* <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0"> */}
        {props.children}
        {/* </span> */}
      </button>
    );
  }
};

export default Button;
