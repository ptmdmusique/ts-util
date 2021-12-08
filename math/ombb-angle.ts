// * --- Types
class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  toPoint(): Point {
    return [this.x, this.y];
  }

  static fromPoint(p: Point): Vector {
    return new Vector(p[0], p[1]);
  }

  static diff(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static normalize(v: Vector): Vector {
    return new Vector(v.x / v.len(), v.y / v.len());
  }

  static dot(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static orthogonal(v: Vector): Vector {
    return new Vector(v.y, -v.x);
  }

  static negate(v: Vector): Vector {
    return new Vector(-v.x, -v.y);
  }

  distance(v: Vector) {
    const x = this.x - v.x;
    const y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
  }
}

type Point = [number, number];

// * --- Utils
const sortPointListClockwise = (points: Point[]) => {
  const temp = [...points];
  // * Find center
  // Find min max to get center
  // Sort from top to bottom
  temp.sort((a, b) => a[1] - b[1]);
  // Get center y
  const cy = (temp[0][1] + temp[temp.length - 1][1]) / 2;

  // Sort from right to left
  temp.sort((a, b) => b[0] - a[0]);
  // Get center x
  const cx = (temp[0][0] + temp[temp.length - 1][0]) / 2;

  const center = Vector.fromPoint([cx, cy]);

  // * Sort based on angle
  const sortedPoints = temp.sort((a, b) => {
    const d1 = Vector.diff(Vector.fromPoint(a), center).toPoint();
    const d2 = Vector.diff(Vector.fromPoint(b), center).toPoint();
    const angle1 = Math.atan2(d1[1], d1[0]);
    const angle2 = Math.atan2(d2[1], d2[0]);
    return angle1 - angle2;
  });

  return sortedPoints;
};

// * ---  Main
/**
 * The idea is:
 * 1. Find convex hull of the pointset
 * 2. Find the oriented minimum bounding box (ombb) of the convex hull
 * 3. Find the angle of the box based on the longer side
 */

// --- Get convex hull
function getConvexHull(pointset: Point[]) {
  // ! Pointset has to be sorted by X
  const crossVectors = (origin: Point, pointA: Point, pointB: Point) => {
    // Based on the rule vA = k vB then vA is parallel to vB
    return (
      (pointA[0] - origin[0]) * (pointB[1] - origin[1]) -
      (pointA[1] - origin[1]) * (pointB[0] - origin[0])
    );
  };

  const getUpperTangent = (pointset: Point[]) => {
    const lower: Point[] = [];
    for (let l = 0; l < pointset.length; l++) {
      while (
        lower.length >= 2 &&
        crossVectors(
          lower[lower.length - 2],
          lower[lower.length - 1],
          pointset[l],
        ) <= 0
      ) {
        lower.pop();
      }
      lower.push(pointset[l]);
    }

    lower.pop();
    return lower;
  };

  const getLowerTangent = (pointset: Point[]) => {
    const reversed = pointset.reverse(),
      upper: Point[] = [];
    for (let u = 0; u < reversed.length; u++) {
      while (
        upper.length >= 2 &&
        crossVectors(
          upper[upper.length - 2],
          upper[upper.length - 1],
          reversed[u],
        ) <= 0
      ) {
        upper.pop();
      }
      upper.push(reversed[u]);
    }
    upper.pop();
    return upper;
  };

  const upper = getUpperTangent(pointset),
    lower = getLowerTangent(pointset);
  const convex = lower.concat(upper);
  return convex;
}

// --- Get OMBB
const getOrientedMinimumBoundingBox = (
  pointList: [number, number][],
): Point[] | null => {
  type BestOmbb = [Vector, Vector, Vector, Vector];

  // * Rotating calipers algorithm
  // https://github.com/geidav/ombb-rotating-calipers/blob/master/ombb.js

  // ? Note: ombb = Oriented Minimum Bounding Box
  // --- Helpers
  const getNextIndex = (currentIndex: number): number =>
    (currentIndex + 1) % pointList.length;

  const getIntersectionPoint = (
    // point0 and dir0 create line 0
    point0: Vector,
    dir0: Vector,
    // point1 and dir1 create line 1
    point1: Vector,
    dir1: Vector,
  ): Vector => {
    // TODO: figure out the meaning of this
    const dd = dir0.x * dir1.y - dir0.y * dir1.x;
    const xDiff = point1.x - point0.x;
    const yDiff = point1.y - point0.y;
    // dd = 0 => lines are parallel. we don't care as our lines are never parallel.
    const t = (xDiff * dir1.y - yDiff * dir1.x) / dd;
    return new Vector(point0.x + t * dir0.x, point0.y + t * dir0.y);
  };

  const getNewOmbb = (
    leftStart: Vector,
    leftDir: Vector,
    rightStart: Vector,
    rightDir: Vector,
    topStart: Vector,
    topDir: Vector,
    bottomStart: Vector,
    bottomDir: Vector,
  ): { ombb: BestOmbb; area: number } => {
    const obbUpperLeft = getIntersectionPoint(
      leftStart,
      leftDir,
      topStart,
      topDir,
    );
    const obbUpperRight = getIntersectionPoint(
      rightStart,
      rightDir,
      topStart,
      topDir,
    );
    const obbLowerLeft = getIntersectionPoint(
      bottomStart,
      bottomDir,
      leftStart,
      leftDir,
    );
    const obbLowerRight = getIntersectionPoint(
      bottomStart,
      bottomDir,
      rightStart,
      rightDir,
    );

    const obbArea =
      obbUpperLeft.distance(obbUpperRight) *
      obbUpperLeft.distance(obbLowerLeft);

    return {
      area: obbArea,
      ombb: [obbUpperLeft, obbUpperRight, obbLowerLeft, obbLowerRight],
    };
  };

  // --- Actual implementation
  const vectorList = pointList.map(([x, y]) => new Vector(x, y));

  // * Normalized vector list (vector with length 1)
  const edgeDirectionList = vectorList.map((v, index) => {
    return Vector.normalize(Vector.diff(vectorList[getNextIndex(index)], v));
  });

  const minPoint = new Vector(Number.MAX_VALUE, Number.MAX_VALUE);
  const maxPoint = new Vector(-Number.MAX_VALUE, -Number.MAX_VALUE);
  let leftIndex: number = 0;
  let rightIndex: number = 0;
  let topIndex: number = 0;
  let bottomIndex: number = 0;

  // * Find the outermost points
  for (let i = 0; i < vectorList.length; i++) {
    const vector = vectorList[i];

    if (vector.x < minPoint.x) {
      minPoint.x = vector.x;
      leftIndex = i;
    }

    if (vector.x > maxPoint.x) {
      maxPoint.x = vector.x;
      rightIndex = i;
    }

    if (vector.y < minPoint.y) {
      minPoint.y = vector.y;
      bottomIndex = i;
    }

    if (vector.y > maxPoint.y) {
      maxPoint.y = vector.y;
      topIndex = i;
    }
  }

  let bestArea = Number.MAX_SAFE_INTEGER;
  let bestOmbb: BestOmbb | undefined = undefined;

  const isOmbbInside = (ombb: BestOmbb) => {
    const [xMin, yMin] = minPoint.toPoint();
    const [xMax, yMax] = maxPoint.toPoint();
    return ombb.some(
      (v) => v.x > xMin && v.x < xMax && v.y > yMin && v.y < yMax,
    );
  };

  // initial caliper lines + directions
  //
  //        top
  //      <-------
  //      |      ^
  //      |      | right
  // left |      |
  //      V      |
  //      ------->
  //       bottom
  // Note: all of these are normalized vectors
  let leftDir = new Vector(0, -1);
  let rightDir = new Vector(0, 1);
  let topDir = new Vector(-1, 0);
  let bottomDir = new Vector(1, 0);

  for (let i = 0; i < vectorList.length; i++) {
    // --- Angle between the edge and the caliper line ---
    // angle between 2 vectors = arc cosine of the dot product of the directional vectors
    // since we already have the normalized vectors, we can use the dot product then arc cosine it
    // 0 = left, 1 = right, 2 = top, 3 = bottom
    const phiList = [
      Math.acos(Vector.dot(leftDir, edgeDirectionList[leftIndex])),
      Math.acos(Vector.dot(rightDir, edgeDirectionList[rightIndex])),
      Math.acos(Vector.dot(topDir, edgeDirectionList[topIndex])),
      Math.acos(Vector.dot(bottomDir, edgeDirectionList[bottomIndex])),
    ];

    const edgeIndexWithSmallestAngle = phiList.indexOf(Math.min(...phiList));

    // Based on the smallest angle, update the caliper line
    //  and construct the next oriented minimum bounding box candidate
    //  using parallel and orthogonal lines
    switch (edgeIndexWithSmallestAngle) {
      case 0:
        leftDir = edgeDirectionList[leftIndex].clone();
        rightDir = Vector.negate(leftDir);
        topDir = Vector.orthogonal(leftDir);
        bottomDir = Vector.negate(topDir);

        leftIndex = getNextIndex(leftIndex);
        break;
      case 1:
        rightDir = edgeDirectionList[rightIndex].clone();
        leftDir = Vector.negate(rightDir);
        topDir = Vector.orthogonal(leftDir);
        bottomDir = Vector.negate(topDir);

        rightIndex = getNextIndex(rightIndex);
        break;
      case 2:
        topDir = edgeDirectionList[topIndex].clone();
        bottomDir = Vector.negate(topDir);
        leftDir = Vector.orthogonal(bottomDir);
        rightDir = Vector.negate(leftDir);

        topIndex = getNextIndex(topIndex);
        break;
      case 3:
        bottomDir = edgeDirectionList[bottomIndex].clone();
        topDir = Vector.negate(bottomDir);
        leftDir = Vector.orthogonal(bottomDir);
        rightDir = Vector.negate(leftDir);

        bottomIndex = getNextIndex(bottomIndex);
        break;
    }

    const { area, ombb } = getNewOmbb(
      vectorList[leftIndex],
      leftDir,
      vectorList[rightIndex],
      rightDir,
      vectorList[topIndex],
      topDir,
      vectorList[bottomIndex],
      bottomDir,
    );

    if (area < bestArea && !isOmbbInside(ombb)) {
      bestArea = area;
      bestOmbb = ombb;
    }
  }

  return bestOmbb?.map((v) => v.toPoint()) ?? null;
};

// --- Get angle
const getVectorAngleToXAxis = (x: number, y: number) =>
  (Math.atan2(y, x) * 180) / Math.PI;

const getOmbbAngle = (ombbPointList: Point[]) => {
  if (ombbPointList) {
    // * Find the longest edge
    const sortedEdgeLengthList = sortPointListClockwise(ombbPointList);
    const { length, startIndex } = sortedEdgeLengthList.reduce<{
      startIndex: number;
      length: number;
    }>(
      (acc, curr, curIndex, arr) => {
        const nextIndex = (curIndex + 1) % arr.length;
        const curPoint = Vector.fromPoint(curr);
        const nextPoint = Vector.fromPoint(arr[nextIndex]);
        const distance = curPoint.distance(nextPoint);

        return distance > acc.length
          ? { length: distance, startIndex: curIndex }
          : acc;
      },
      { length: 0, startIndex: 0 },
    );

    // * Get the angle
    const startPoint = sortedEdgeLengthList[startIndex];
    const endPoint =
      sortedEdgeLengthList[(startIndex + 1) % sortedEdgeLengthList.length];
    const edgeDirection: Point = [
      endPoint[0] - startPoint[0],
      endPoint[1] - startPoint[1],
    ];

    const ombbAngle = getVectorAngleToXAxis(edgeDirection[0], edgeDirection[1]);

    return ombbAngle;
  }
};

// * --- Testing
const pointList: Point[] = [
  [1, 2],
  [2, 4],
  [5, 3],
  [2, 0],
  [2, 2],
];

const xSortedPointList = [...pointList].sort((a, b) => a[0] - b[0]);

// 1.
const convexHullList = getConvexHull(xSortedPointList);
const clockwisePointList = sortPointListClockwise(convexHullList);

// 2.
const ombbPointList = getOrientedMinimumBoundingBox(clockwisePointList);

// 3.
if (ombbPointList) {
  const ombbAngle = getOmbbAngle(ombbPointList);
  console.info(`OMBB Angle based on longer vector ${ombbAngle}`);
}
