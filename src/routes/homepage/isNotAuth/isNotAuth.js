import React from "react";
import { BsCarousel } from "../../../core/elements/BsCarousel";
import { Carousel1, Carousel2, Carousel3 } from "./partials/Carousels";
import Section from "./partials/Section";
import { AppContext } from "../../../App";

const IsNotAuth = React.memo(function () {
    const { screenWidth } = React.useContext(AppContext);

    const childrenHeight = React.useMemo(() => {
        if (screenWidth < 285) {
            return 350;
        } else if (screenWidth >= 285 && screenWidth < 576) {
            return 375;
        }
        return 280;
    }, [screenWidth]);

    return <div className="container">
        <BsCarousel contents={[Carousel1, Carousel2, Carousel3]}
            interval="3000" controls={false}
            childrenHeight={childrenHeight} />
        <Section />
    </div>
});

export default IsNotAuth;