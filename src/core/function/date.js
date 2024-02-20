import i18next from "i18next";

function toTwoNumbers(number) {
    const string = `${number}`.padStart(2, '0');
    return string;
}

/**
 * outputs a Date object into an ISO Format (yyyy-mm-dd)
 * @param {Date} date
 * @returns {string} the specified or the current ISO formated date.
 */
export function getIsoDate(date = null) {
    let toIsoDate = date || new Date();
    return `${toIsoDate.getFullYear()}-${toTwoNumbers(toIsoDate.getMonth() + 1)}-${toTwoNumbers(toIsoDate.getDate())}`;
}

/**
 * converts an ISO-formated date into a timestamp and can alter it.
 * @param {string} date 
 * @param {int|null} renewal_frequency_id [2 => "week", 3 => "month"];
 * @param {int|null} n the repetition of the renewal_frequency_id (eg : 2 weeks)
 * @returns {int} the new timestamp
 */
export function formatDate(date, renewal_frequency_id = null) {
    const newDate = new Date(date);
    switch (parseInt(renewal_frequency_id)) {
        case 2:
            newDate.setDate(newDate.getDate() + 7);
            break;

        case 3:
            newDate.setMonth(newDate.getMonth() + 1);
            break;

        default:
            break;
    }

    return getIsoDate(newDate);
}

const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}

const languageVariants = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    mg: 'mg-MG'
};

const locale = languageVariants[i18next.language];

export const dateFormater = (iso) => {
    const date = new Date(iso);
    return Intl.DateTimeFormat(locale, dateOptions).format(date);
};