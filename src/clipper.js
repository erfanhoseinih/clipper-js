Array.prototype.end = function () {
  return this[this.length - 1];
};

Array.prototype.start = function () {
  return this[0];
};

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

function checkPointinobj(x, y, path) {
  let bol1 = false;
  let bol2 = false;
  let bol3 = false;
  let bol4 = false;
  let lenofLine = 100000;

  let num2 = 2;
  let p0 = new vector(x, y);
  let p1 = new vector(-lenofLine * 2, y - num2);
  let p2 = new vector(lenofLine * 2, y + num2);
  let p3 = new vector(x + num2, -lenofLine * 2);
  let p4 = new vector(x - num2, lenofLine * 2);
  let num1 = 0;

  for (let ich = 0; ich < path.length - 1; ich++) {
    if (
      inteLine(Parangle(p0, p1, num1), [path[ich], path[ich + 1]]) &&
      bol1 == false
    ) {
      bol1 = true;
    } else if (
      inteLine(Parangle(p0, p1, num1), [path[ich], path[ich + 1]]) &&
      bol1 == true
    ) {
      bol1 = false;
    }
    if (
      inteLine(Parangle(p0, p2, num1), [path[ich], path[ich + 1]]) &&
      bol2 == false
    ) {
      bol2 = true;
    } else if (
      inteLine(Parangle(p0, p2, num1), [path[ich], path[ich + 1]]) &&
      bol2 == true
    ) {
      bol2 = false;
    }
    if (
      inteLine(Parangle(p0, p3, num1), [path[ich], path[ich + 1]]) &&
      bol3 == false
    ) {
      bol3 = true;
    } else if (
      inteLine(Parangle(p0, p3, num1), [path[ich], path[ich + 1]]) &&
      bol3 == true
    ) {
      bol3 = false;
    }
    if (
      inteLine(Parangle(p0, p4, num1), [path[ich], path[ich + 1]]) &&
      bol4 == false
    ) {
      bol4 = true;
    } else if (
      inteLine(Parangle(p0, p4, num1), [path[ich], path[ich + 1]]) &&
      bol4 == true
    ) {
      bol4 = false;
    }
  }

  return bol1 && bol2 && bol3 && bol4;
}

function fixZeroIdx(paths0, paths1) {
  if (checkPointinobj(paths0[0].x, paths0[0].y, paths1)) {
    let fistStart;

    for (let i = 0; i < paths0.length; i++) {
      if (!checkPointinobj(paths0[i].x, paths0[i].y, paths1)) {
        fistStart = i;
        break;
      }
    }

    return sortVec(paths0, fistStart + 1);
  } else {
    return paths0;
  }
}
function sortVec(a, fistStart) {
  let tempSortArr = [];

  for (let i = 0; i < a.length; i++) {
    tempSortArr.push(a[(i + fistStart) % a.length]);
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

function shapeClliper(path) {
  path = clearRepPoints(path);
  path = closePath(path);
  return path;
}

function lineClliper(path) {
  path = clearRepPoints(path);
  return path;
}

function removeDupInte(a, b) {
  return a[2].x != b[2].x || a[2].y != b[2].y;
}

Array.prototype.indexOfVec = function (a) {
  let foundInteIndex_idx = -1;
  for (let ikj = 0; ikj < this.length - 1; ikj++) {
    if (this[ikj].x == a.x && this[ikj].y == a.y) {
      foundInteIndex_idx = ikj;
      break;
    }
  }
  return foundInteIndex_idx;
};

function reversePath(mainShape, secondShape) {
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
    indexOfStartPath1.idx > indexOfEndPath1.idx
  ) {
    secondShape.reverse();
  }
}

function shapeCutter(path0, path1) {
  stroke(0);

  if (path0.start() == path0.end() && path1.start() == path1.end()) {
    path0 = fixZeroIdx(path0, path1);
    path1 = fixZeroIdx(path1, path0);
  }

  if (path1.start() != path1.end()) {
    reversePath(path0, path1);
  }

  let IntePoints = [];
  for (let a = 0; a < path1.length - 1; a++) {
    for (let b = 0; b < path0.length - 1; b++) {
      if (inteLine([path1[a], path1[a + 1]], [path0[b], path0[b + 1]])) {
        let p = inteLine([path1[a], path1[a + 1]], [path0[b], path0[b + 1]]);

        IntePoint = [[path1[a], path1[a + 1]], [path0[b], path0[b + 1]], p];
        // console.log(IntePoint)
        // IntePoint = [path1[a], path0[b], p];
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
    return;
  }

  for (let i = 0; i < IntePoints.length; i += 2) {
    let mainIdx, scondIdx;
    let currentShape;

    shapes_cutted.forEach((es) => {
      let p0 = IntePoints[i][1][0];
      let p1 = IntePoints[i + 1][1][0];

      if (es.indexOf(p0) > -1 && es.indexOf(p1) > -1) {
        currentShape = es;

        return;
      }
    });

    if (!currentShape) {
      throw "currentShape is undefined";
    }

    let p0 = IntePoints[i][0][0];
    let p1 = IntePoints[i + 1][0][0];

    scondIdx = sortIdx(path1.indexOfVec(p0), path1.indexOfVec(p1));
    scondShape = path1.slice(scondIdx[0] + 1, scondIdx[1] + 1);

    scondShape.unshift(IntePoints[i][2]);

    scondShape.push(IntePoints[i + 1][2]);

    reversePath(currentShape, scondShape);

    p0 = IntePoints[i][1][0];
    p1 = IntePoints[i + 1][1][0];

    mainIdx = sortIdx(currentShape.indexOfVec(p0), currentShape.indexOfVec(p1));

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
