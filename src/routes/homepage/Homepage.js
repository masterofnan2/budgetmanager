import React from "react";
import { AppContext } from "../../App";
import IsAuth from "./isAuth/isAuth";
import IsNotAuth from "./isNotAuth/isNotAuth";

const HomePage = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext)
    
    return <>
        <div className="my-5">
            <div className="col-lg-10 col">
                {AuthContext.state ? <IsAuth /> : <IsNotAuth />}
            </div>
        </div>
    </>
})

export default HomePage;