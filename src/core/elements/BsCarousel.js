import { Carousel } from "bootstrap";
import React from "react";
import { useLocation } from "react-router-dom";

export const HeightContext = React.createContext(null);

export const BsCarousel = React.memo(function ({ contents, interval, controls, childrenHeight }) {
    const [height, setHeight] = React.useState(childrenHeight || null);
    const carouselRef = React.useRef();
    const location = useLocation();

    React.useEffect(() => {
        if (location.search) {
            const signup = new URLSearchParams(location.search).get('signup');

            if (signup && carouselRef.current) {
                const carousel = new Carousel(carouselRef.current);
                carousel.next();
            }
        }
    }, [location.search, carouselRef]);

    const alterHeight = React.useCallback((n) => {
        setHeight(parseInt(childrenHeight) + (20 * n));
    }, [childrenHeight]);

    return <HeightContext.Provider value={alterHeight}>
        <div id="BsCarousel" className="carousel slide" data-bs-ride="true"
            data-bs-interval={interval} ref={carouselRef}>
            <div className="carousel-indicators">
                {contents.map((Content, key) => {
                    return <button key={key} type="button" data-bs-target="#BsCarousel"
                        data-bs-slide-to={key}
                        className={key === 0 ? "active" : ""}>
                    </button>
                })}
            </div>
            <div className="carousel-inner" role="listbox">
                {contents.map((Content, key) => {
                    return <React.Fragment key={key}>
                        <div className={`carousel-item ${key === 0 ? "active" : ""}`} style={{ height: height ? `${height}px` : "auto" }}>
                            {<Content />}
                        </div>
                    </React.Fragment>
                })}
            </div>

            <button className={`carousel-control-prev d-none ${controls && "d-sm-flex"}`}
                type="button" data-bs-target="#BsCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className={`carousel-control-next d-none ${controls && "d-sm-flex"}`} type="button"
                data-bs-target="#BsCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </HeightContext.Provider>
})
