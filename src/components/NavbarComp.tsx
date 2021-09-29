import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose, AiOutlineProject, AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsFillChatDotsFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../styles/navbarComp.css";
import { IconContext } from "react-icons";
import useWindowDimensions from "../customHooks/useWindowDimensions";
// import { dividerClasses } from "@mui/material";

function NavbarComp() {
  const windowDimensions = useWindowDimensions();
  const [activeNav, setActiveNav] = useState(0);
  const [sidebar, setSidebar] = useState(
    windowDimensions.width > 768 ? true : false
  );

  const showSidebar = () => setSidebar(!sidebar);

  const handleActiveNav = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    key: number
  ) => {
    setActiveNav(key);
  };

  useEffect(() => {
    if (windowDimensions.width < 768) setSidebar(false);
    else setSidebar(true);
  }, [windowDimensions]);

  return (
    <div className="navbarOuterDiv">
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar" style={{}}>
          {windowDimensions.width < 768 ? (
            <Link to="#" className="menu-bars">
              <FaBars onClick={showSidebar} />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
        <nav
          className={
            windowDimensions.width < 768
              ? sidebar
                ? "nav-menu active"
                : "nav-menu"
              : "nav-menu active"
          }
        >
          <ul className="nav-menu-items" onClick={showSidebar}>
            {windowDimensions.width < 768 ? (
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiOutlineClose />
                </Link>
              </li>
            ) : (
              <li></li>
            )}
            <li
              key={1}
              className={`nav-text ${activeNav === 1 ? "nav-text-active" : ""}`}
              onClick={(e) => handleActiveNav(e, 1)}
            >
              <Link to="/app/projects/create">
                <FiPlusCircle />
                <span>Create Project</span>
              </Link>
            </li>
            <li
              key={2}
              className={`nav-text ${activeNav === 2 ? "nav-text-active" : ""}`}
              onClick={(e) => handleActiveNav(e, 2)}
            >
              <Link to="/app/feeds">
                <AiFillHome />
                <span>feeds</span>
              </Link>
            </li>
            <li
              key={3}
              className={`nav-text ${activeNav === 3 ? "nav-text-active" : ""}`}
              onClick={(e) => handleActiveNav(e, 3)}
            >
              <Link to="/app/profile">
                <CgProfile />
                <span>Profile</span>
              </Link>
            </li>
            <li
              key={4}
              className={`nav-text ${activeNav === 4 ? "nav-text-active" : ""}`}
              onClick={(e) => handleActiveNav(e, 4)}
            >
              <Link to="/app/projects">
                <AiOutlineProject />
                <span>Projects</span>{" "}
              </Link>
            </li>
            <li
              key={5}
              className={`nav-text ${activeNav === 5 ? "nav-text-active" : ""}`}
              onClick={(e) => handleActiveNav(e, 5)}
            >
              <Link to="/app/chat">
                <BsFillChatDotsFill />
                <span>Chat</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default NavbarComp;
