export default function getPercentage(needle, haystack) {
    if ((needle && !isNaN(needle)) && (haystack && !isNaN(haystack))) {
        return Math.round((needle * 100 / haystack))
    } else {
        return 0;
    }
}