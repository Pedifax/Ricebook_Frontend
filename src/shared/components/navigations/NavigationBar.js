import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import SideDrawer from "./SideDrawer";
import BlackBackground from "../UIs/BlackBackground";
import { AppContext } from "../../context/app-context";

const NavigationBar = () => {
  const app_context = useContext(AppContext);
  const [drawer_is_open, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {drawer_is_open && <BlackBackground onClick={closeDrawerHandler} />}
      {drawer_is_open && (
        <SideDrawer drawer_is_open onClick={closeDrawerHandler} />
      )}

      <div className="mx-auto flex flex-wrap items-center justify-between border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <NavLink to="/" className="flex items-center" exact>
          <img
            src={require("../../images/logo.png")}
            className="mr-1 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Ricebook
          </span>
        </NavLink>

        <div className="flex items-center">
          <NavLink to="/" exact>
            <span className="mr-2 hidden rounded-lg  px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 md:block md:px-5 md:py-2.5">
              Feed
            </span>
          </NavLink>
          <NavLink to="/profile" exact>
            <span className="mr-2 hidden rounded-lg  px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 md:block md:px-5 md:py-2.5">
              Profile
            </span>
          </NavLink>
          {app_context.isLoggedIn && (
            <button
              className="mr-2 hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-red-500 hover:text-white focus:outline-none md:block md:px-5 md:py-2.5"
              onClick={app_context.logout}
              data-testid='logout_button'
            >
              Logout
            </button>
          )}

          <button
            // data-collapse-toggle="mobile-menu-2"
            // type="button"
            className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 md:hidden "
            // aria-controls="mobile-menu-2"
            // aria-expanded="false"
            onClick={openDrawerHandler}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavigationBar;
