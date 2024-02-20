import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App";
import { DisplayImage } from "../minitatures";
import Offcanvas from "./Offcanvas/Offcanvas";
import useWsSession from "../../../api/hooks/useWsSession";

const Navbar = React.memo(function () {
    const { screenWidth } = React.useContext(AppContext);

    useWsSession();

    return <div style={(screenWidth < 992 && {marginBottom: "80px"}) || {}}>
        {screenWidth < 992 &&
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand text-success" to="/">
                            <div className="d-flex">
                                <div className="align-self-center">
                                    <DisplayImage imageName="project_management" />
                                </div>
                                <div>
                                    <i className="fa fa-bold text-light"></i>udgetManager
                                </div>
                            </div>
                        </Link>
                        <div className="d-flex">
                            <div>
                                <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>}
        <Offcanvas />
    </div>
});

export default Navbar;