function getBoxRangeFromWorldWindRange(range, width, height) {
    if (width && width >= height) {
        return Math.round(range * height/width);
    } else {
        return range;
    }
}

function getWorldWindRangeFromBoxRange(boxRange, width, height) {
    if (width && width >= height) {
        return Math.round(boxRange * width/height);
    } else {
        return boxRange;
    }
}

export default {
    getBoxRangeFromWorldWindRange,
    getWorldWindRangeFromBoxRange
}