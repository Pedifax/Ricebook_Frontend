import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/app-context";

const SideDrawer = (props) => {
  const app_context = useContext(AppContext);

  const drawer_content = (
    <div onClick={props.onClick}>
      <div
        id="drawer-navigation"
        className="fixed z-40 h-screen p-4 overflow-y-auto bg-white w-48 dark:bg-gray-800"
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <NavLink to="/" className="flex items-center" exact>
          <img
            src={require("../../images/logo.png")}
            className="mr-1 h-6 sm:h-9"
            alt="Ricebook Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Ricebook
          </span>
        </NavLink>

        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Feed</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
              </NavLink>
            </li>
            <li>
              {app_context.isLoggedIn && (
                <button
                  className="text-gray-800 bg-pink-400 font-medium rounded-lg text-sm px-4  py-2  mr-2 focus:outline-none w-32"
                  onClick={() => {
                    app_context.logout();
                  }}
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    drawer_content,
    document.getElementById("drawer-hook")
  );
};

export default SideDrawer;
