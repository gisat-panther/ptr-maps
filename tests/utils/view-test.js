import {assert} from 'chai';
import view from "../../src/utils/view";

describe('utils/view', function () {
    describe('getBoxRangeFromWorldWindRange', function () {
        it('return range part if width is bigger', function () {
            assert.equal(view.getBoxRangeFromWorldWindRange(10, 50, 10), 2);
            assert.equal(view.getBoxRangeFromWorldWindRange(10, 100, 10), 1);
            assert.equal(view.getBoxRangeFromWorldWindRange(10, 50, 49), 9.8);
        });

        it('return range if height is bigger', function () {
            const range = 10;
            const output = view.getBoxRangeFromWorldWindRange(range, 20, 30);
            assert.equal(output, 10);
        });

        it('return range if width is 0, null or undefined', function () {
            const range = 10;
            const output0 = view.getBoxRangeFromWorldWindRange(range, 0, 30);
            const outputNull = view.getBoxRangeFromWorldWindRange(range, null, 30);
            const outputUndefined = view.getBoxRangeFromWorldWindRange(range, undefined, 30);
            assert.equal(output0, range);
            assert.equal(outputNull, range);
            assert.equal(outputUndefined, range);
        });
    });

    describe('getWorldWindRangeFromBoxRange', function () {
        it('return range multiple if width is bigger', function () {
            assert.equal(view.getWorldWindRangeFromBoxRange(10, 50, 10), 50);
            assert.equal(view.getWorldWindRangeFromBoxRange(10, 100, 10), 100);
            assert.equal(view.getWorldWindRangeFromBoxRange(10, 50, 25), 20);
        });

        it('return range if height is bigger', function () {
            const boxRange = 10;
            const output = view.getWorldWindRangeFromBoxRange(boxRange, 20, 30);
            assert.equal(output, 10);
        });

        it('return range if width is 0, null or undefined', function () {
            const boxRange = 10;
            const output0 = view.getWorldWindRangeFromBoxRange(boxRange, 0, 30);
            const outputNull = view.getWorldWindRangeFromBoxRange(boxRange, null, 30);
            const outputUndefined = view.getWorldWindRangeFromBoxRange(boxRange, undefined, 30);
            assert.equal(output0, boxRange);
            assert.equal(outputNull, boxRange);
            assert.equal(outputUndefined, boxRange);
        });
    });

    describe('boxRangeToWorldWindRangeAndBack', function () {
        it('return the range value', function () {
            const boxRange1 = 10000;
            const height1 = 25;
            const width1 = 50;

            const range = view.getWorldWindRangeFromBoxRange(boxRange1, width1, height1);
            assert.equal(boxRange1, view.getBoxRangeFromWorldWindRange(range, width1, height1));

            const height2 = 4999;
            const width2 = 5000;

            const range2 = view.getWorldWindRangeFromBoxRange(boxRange1, width2, height2);
            assert.equal(boxRange1, view.getBoxRangeFromWorldWindRange(range2, width2, height2));

            const height3 = 478;
            const width3 = 604;

            const range3 = view.getWorldWindRangeFromBoxRange(boxRange1, width3, height3);
            assert.equal(boxRange1, view.getBoxRangeFromWorldWindRange(range3, width3, height3));

            const height4 = 10;
            const width4 = 30;

            const range4 = view.getWorldWindRangeFromBoxRange(boxRange1, width4, height4);
            assert.equal(boxRange1, view.getBoxRangeFromWorldWindRange(range4, width4, height4));
        });
    });

    describe('getBoxRangeFromZoomLevel', function () {

        it('returns box range', function () {
            const width = 600; //px
            const height = 300; //px
            const boxRange = view.getBoxRangeFromZoomLevel(0, width, height);
    
            assert.equal(boxRange, 30187175.77750529);
        });
    
        it('returns box range', function () {
            const width = 300; //px
            const height = 600; //px
            const boxRange = view.getBoxRangeFromZoomLevel(0, width, height);
    
            assert.equal(boxRange, 30187175.77750529);
        });
    });
    
    describe('getPixelSizeFromZoomLevel', function () {
    
        it('returns pixel size for zero level in default latitude', function () {
            const pixelSize = view.getPixelSizeFromZoomLevel(0);
            assert.equal(pixelSize, 100623.9225916843);
        });
    
        it('returns pixel size for 9-th level in default latitude', function () {
            const pixelSize = view.getPixelSizeFromZoomLevel(9);
            assert.equal(pixelSize, 196.53109881188323);
        });
    });
});