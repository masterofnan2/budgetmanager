import React from "react";
import { DisplayImage } from "../../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";
import { Carousel } from "bootstrap";

export const Carousel1 = React.memo(function () {

    React.useEffect(() => {
        const carouselElement = document.getElementById('BsCarousel');
        if (carouselElement) {
            const carousel = new Carousel(carouselElement);
            setTimeout(() => {
                carousel.cycle();
            }, 1000)
        }

        return clearTimeout();
    }, []);

    const { t } = useTranslation();
    return <>
        <div className="p-3 rounded h-100" style={{ backgroundColor: "#2351fb" }}>
            <div className="d-flex flex-wrap flex-sm-nowrap">
                <div className="mx-auto align-self-center">
                    <DisplayImage imageName="money_bag" />
                </div>
                <div className="align-self-center col-12 col-sm-6" style={{ textAlign: "center" }}>
                    <div className="display-5 text-light mb-2">{t('carousel_1_title')}</div>
                    <p className="text-warning shadow-lg d-none d-lg-block">
                        {t('carousel_1_description')}
                    </p>
                </div>
            </div>
        </div>
    </>
});

export const Carousel2 = React.memo(function () {
    const { t } = useTranslation();

    return <>
        <div className="p-3 rounded h-100" style={{ backgroundColor: "#6bad02" }}>
            <div className="d-flex flex-wrap flex-sm-nowrap">
                <div className="align-self-center mx-auto mb-3 mb-sm-0">
                    <div className="display-5 text-light">{t('carousel_2_title')}</div>
                </div>
                <div className="mx-auto">
                    <DisplayImage imageName="finance" />
                </div>
                <p className="shadow-sm text-light rounded p-2 col-md-4 col ms-5 align-self-center d-none d-lg-block">
                    {t('carousel_2_description')}
                </p>
            </div>
        </div>
    </>
})

export const Carousel3 = React.memo(function () {
    const { t } = useTranslation();

    return <>
        <div className="p-3 pt-sm-5 pt-md-3 pt-lg-5 rounded h-100" style={{ backgroundColor: "#383333" }}>
            <div className="d-flex flex-wrap flex-sm-nowrap">
                <div className="align-self-center mx-auto">
                    <div className="display-5 text-light mb-2">{t('carousel_3_title')}</div>
                    <p className="shadow rounded p-2 col-md-10 col-12 d-none d-lg-block" style={{ color: "#ce9b7e" }}>
                        {t('carousel_3_description')}
                    </p>
                </div>
                <div className="mx-auto align-self-center">
                    <DisplayImage imageName="growth" />
                </div>
            </div>
        </div>
    </>
})