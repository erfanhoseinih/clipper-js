Array.prototype.end = function () {
  return this[this.length - 1];
};

Array.prototype.first = function () {
  return this[0];
};

Array.prototype.indexOfVec = function (a) {
  return this.findIndex((item) => item.x === a.x && item.y === a.y);
};

Array.prototype.flexIndex = function (idx) {
  if (idx >= 0) {
    return this[idx % this.length];
  } else {
    return this[this.length - (Math.abs(idx) % this.length)];
  }
};

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.clipper = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function dist(...args) {
    let y, x, z, n;
    if (args.length == 6) {
      x = args[3] - args[0];
      y = args[4] - args[1];
      z = args[5] - args[2];
      n = Math.sqrt(x * x + y * y + z * z);
    } else if (args.length == 4) {
      x = args[2] - args[0];
      y = args[3] - args[1];
      n = Math.sqrt(x * x + y * y);
    }
    return n;
  }

  function lerp(v0, v1, v2) {
    return v1 + (v0 - v1) * v2;
  }

  function Parangle(p0, p1, n1) {
    const n2 = (-n1 / dist(p0.x, p0.y, p1.x, p1.y)) * 1.4143;
    const n3 = 1;

    return [
      {
        x: parseFloat(lerp(p0.x, p1.x, n2).toFixed(n3)),
        y: parseFloat(lerp(p0.y, p1.y, n2).toFixed(n3)),
      },
      {
        x: parseFloat(lerp(p0.x, p1.x, 1 - n2).toFixed(n3)),
        y: parseFloat(lerp(p0.y, p1.y, 1 - n2).toFixed(n3)),
      },
    ];
  }

  function vector(x, y) {
    this.x = x;
    this.y = y;
  }

  function inteLine(l0, l1) {
    let x0 = l0[0].x,
      x1 = l0[1].x,
      x2 = l1[0].x,
      x3 = l1[1].x;
    let y0 = l0[0].y,
      y1 = l0[1].y,
      y2 = l1[0].y,
      y3 = l1[1].y;

    let dem = (y3 - y2) * (x1 - x0) - (x3 - x2) * (y1 - y0);
    if (dem == 0) {
      return;
    }
    let ua_num = (x3 - x2) * (y0 - y2) - (y3 - y2) * (x0 - x2);
    let ub_num = (x1 - x0) * (y0 - y2) - (y1 - y0) * (x0 - x2);

    let ua = ua_num / dem;
    let ub = ub_num / dem;

    if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
      let x = x0 + ua * (x1 - x0);
      let y = y0 + ua * (y1 - y0);
      let vc = { x: x, y: y };
      return vc;
    }
  }

  function closePath(path) {
    if (
      path[0] &&
      (path[0].x != path[path.length - 1].x ||
        path[0].y != path[path.length - 1].y)
    ) {
      path.push(path[0]);
    }
    return path;
  }

  function closeLines(path) {
    if (
      path[0][0].x != path[path.length - 1][1].x ||
      path[0][0].y != path[path.length - 1][1].y
    ) {
      path.push([path[path.length - 1][1], path[0][0]]);
    }
    return path;
  }

  function clearRepPoints(path) {
    for (let i = 0; i < path.length; i++) {
      if (
        path[i].x == path[(i + 1) % path.length].x &&
        path[i].y == path[(i + 1) % path.length].y
      ) {
        path.splice(i, 1);
        i--;
      }
    }
    return path;
  }

  function pointsToLines(path) {
    let lines = [];
    for (let i = 0; i < path.length - 1; i++) {
      lines.push([path[i], path[i + 1]]);
    }
    return lines;
  }

  function linesToPoints(path) {
    let lines = [];
    for (let i = 0; i < path.length; i++) {
      lines.push(path[i][0]);
    }
    lines.push(path[path.length - 1][1]);
    return lines;
  }

  function isPointInsidePolygon(point, polygon) {
    function angleBetween(p1, p2, p3) {
      let dx1 = p1.x - p3.x,
        dy1 = p1.y - p3.y;
      let dx2 = p2.x - p3.x,
        dy2 = p2.y - p3.y;
      let dot = dx1 * dx2 + dy1 * dy2;
      let det = dx1 * dy2 - dy1 * dx2;
      return Math.atan2(det, dot);
    }

    let totalAngle = 0.0;
    for (let i = 0; i < polygon.length; i++) {
      let p1 = polygon[i];
      let p2 = polygon[(i + 1) % polygon.length];

      totalAngle += angleBetween(p1, p2, point);
    }

    return Math.abs(totalAngle) > 1e-6;
  }

  function fixZeroIdx(path0, path1) {
    if (isPointInsidePolygon(path0[0], path1)) {
      let fistStart = 0;

      for (let i = 0; i < path0.length; i++) {
        if (!isPointInsidePolygon(path0[i], path1)) {
          fistStart = i;
          break;
        }
      }
      return sortVec(path0, fistStart + 1);
    } else {
      return path0;
    }
  }

  function sortVec(a, fistStart) {
    let tempSortArr = [];
    for (let b = 0; b < a.length; b++) {
      tempSortArr.push(a[(b + fistStart) % a.length]);
    }
    return tempSortArr;
  }

  function sortIntePoints(IntePoints) {
    for (let i = 0; i < IntePoints.length; i += 2) {
      if (IntePoints[i][1] > IntePoints[i + 1][1]) {
        [IntePoints[i][1], IntePoints[i + 1][1]] = [
          IntePoints[i + 1][1],
          IntePoints[i][1],
        ];
      }
      if (IntePoints[i][0] > IntePoints[i + 1][0]) {
        [IntePoints[i][0], IntePoints[i + 1][0]] = [
          IntePoints[i + 1][0],
          IntePoints[i][0],
        ];
      }
    }
  }

  function sortIdx(n0, n1) {
    return [n0, n1].sort(function (a, b) {
      return a - b;
    });
  }

  function removeDupInte(a, b) {
    return a[2].x != b[2].x || a[2].y != b[2].y;
  }

  function isCounterClockwise(vertices) {
    let sum = 0;
    for (let i = 0; i < vertices.length; i++) {
      let { x: x1, y: y1 } = vertices[i];
      let { x: x2, y: y2 } = vertices[(i + 1) % vertices.length];
      sum += (x2 - x1) * (y2 + y1);
    }
    return sum < 0;
  }

  function ensureCounterClockwise(vertices) {
    if (!isCounterClockwise(vertices)) {
      return vertices.reverse();
    }
    return vertices;
  }

  function fixDirectionPath(mainShape, secondShape) {
    let indexOfStartPath1;
    let indexOfEndPath1;

    for (let a = 0; a < mainShape.length - 1; a++) {
      for (let b = 0; b < secondShape.length - 1; b++) {
        let p = inteLine(
          [mainShape[a], mainShape[a + 1]],
          [secondShape[b], secondShape[b + 1]]
        );
        if (p) {
          if (!indexOfStartPath1) {
            indexOfStartPath1 = { idx: b, p: p };
          } else {
            if (indexOfStartPath1.p.x != p.x || indexOfStartPath1.p.y != p.y) {
              indexOfEndPath1 = { idx: b, p: p };
              break;
            }
          }
        }
      }
      if (indexOfStartPath1 != undefined && indexOfEndPath1 != undefined) {
        break;
      }
    }

    if (
      indexOfStartPath1 &&
      indexOfEndPath1 &&
      indexOfStartPath1.idx >= indexOfEndPath1.idx
    ) {
      secondShape.reverse();
    }
  }

  function initShape(path) {
    path = clearRepPoints(path);
    path = closePath(path);
    return path;
  }

  function initLine(path) {
    path = clearRepPoints(path);
    return path;
  }

  function clip(p0, p1) {
    let path0 = [...p0];
    let path1 = [...p1];

    if (path0.first() == path0.end() && path1.first() == path1.end()) {
      path0 = fixZeroIdx(path0, path1);
      path1 = fixZeroIdx(path1, path0);
    }

    if (path1.first() != path1.end()) {
      fixDirectionPath(path0, path1);
    }

    let IntePoints = [];
    for (let a = 0; a < path1.length; a++) {
      for (let b = 0; b < path0.length; b++) {
        let p0 = path1.flexIndex(a);
        let p1 = path1.flexIndex(a + 1);
        let p2 = path0.flexIndex(b);
        let p3 = path0.flexIndex(b + 1);

        if (inteLine([p0, p1], [p2, p3])) {
          let p = inteLine([p0, p1], [p2, p3]);

          IntePoint = [[p0, p1], [p2, p3], p];

          if (IntePoints.length > 0) {
            let bol = true;
            for (let i = 0; i < IntePoints.length; i++) {
              if (!removeDupInte(IntePoints[i], IntePoint)) {
                bol = false;
              }
            }
            if (bol) {
              IntePoints.push(IntePoint);

              path0.splice(b + 1, 0, p);
              b++;
            }
          } else {
            IntePoints.push(IntePoint);

            path0.splice(b + 1, 0, p);
            b++;
          }
        }
      }
    }

    let shapes_cutted = [];
    shapes_cutted.push(path0);

    let mainShape;
    let scondShape;

    if (IntePoints.length < 2) {
      return [];
    }

    if (IntePoints.length % 2 == 1) {
      IntePoints.pop();
    }

    for (let i = 0; i < IntePoints.length; i += 2) {
      let mainIdx, scondIdx;
      let currentShape;

      shapes_cutted.forEach((es) => {
        let p0 = IntePoints[i][1][0];
        let p1 = IntePoints.flexIndex(i + 1)[1][0];

        if (es.indexOf(p0) > -1 && es.indexOf(p1) > -1) {
          currentShape = es;

          return;
        }
      });

      if (!currentShape) {
        throw "currentShape is undefined";
      }

      let p0 = IntePoints[i][0][0];
      let p1 = IntePoints.flexIndex(i + 1)[0][0];

      scondIdx = sortIdx(path1.indexOfVec(p0), path1.indexOfVec(p1));
      scondShape = path1.slice(scondIdx[0] + 1, scondIdx[1] + 1);

      scondShape.unshift(IntePoints[i][2]);

      scondShape.push(IntePoints.flexIndex(i + 1)[2]);

      fixDirectionPath(currentShape, scondShape);

      p0 = IntePoints[i][1][0];
      p1 = IntePoints.flexIndex(i + 1)[1][0];

      mainIdx = sortIdx(
        currentShape.indexOfVec(p0),
        currentShape.indexOfVec(p1)
      );

      mainShape = currentShape.slice(mainIdx[0] + 1, mainIdx[1] + 1);

      currentShape.splice(mainIdx[0] + 1, mainIdx[1] - mainIdx[0]);

      currentShape.splice(mainIdx[0] + 1, 0, ...scondShape);

      scondShape.reverse();
      mainShape.push(...scondShape);

      currentShape = clearRepPoints(currentShape);
      currentShape = closePath(currentShape);
      mainShape = clearRepPoints(mainShape);
      mainShape = closePath(mainShape);
      shapes_cutted.push(mainShape);
    }

    for (let i = 0; i < shapes_cutted.length; i++) {
      if (shapes_cutted[i].length == 0) {
        shapes_cutted.splice(i, 1);
      }
      shapes_cutted[i] = closePath(shapes_cutted[i]);
    }

    return shapes_cutted;
  }
  return {
    initShape,
    initLine,
    clip,
    __test__: {
      dist,
      lerp,
      inteLine,
      closePath,
      closeLines,
    },
  };
});
