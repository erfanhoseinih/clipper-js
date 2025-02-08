const clipper = require("../src/clipper.js");

describe("Array Prototype Methods", () => {
  test("end() should return the last element of an array", () => {
    expect([1, 2, 3].end()).toBe(3);
  });

  test("first() should return the first element of an array", () => {
    expect([1, 2, 3].first()).toBe(1);
  });

  test("indexOfVec() should return the correct index of an object in an array", () => {
    const arr = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ];
    expect(arr.indexOfVec({ x: 3, y: 4 })).toBe(1);
    expect(arr.indexOfVec({ x: 7, y: 8 })).toBe(-1);
  });

  test("flexIndex() should handel circular indexing correctly", () => {
    const arr = [1, 2, 3];
    expect(arr.flexIndex(1)).toBe(2);
    expect(arr.flexIndex(-1)).toBe(3);
    expect(arr.flexIndex(3)).toBe(1);
  });
});

describe("Math Geometry Functions", () => {
  test("dist() should return length of 2 vector", () => {
    expect(clipper.__test__.dist(0, 0, 10, 10)).toBeCloseTo(14.142, 3);
  });

  test("lerp() should return between of 2 number",()=>{
    expect(clipper.__test__.lerp(2,4,0.5)).toBe(3);
    expect(clipper.__test__.lerp(0,1,0.5)).toBe(0.5);
  })
});
