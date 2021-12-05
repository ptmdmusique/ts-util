export const getVectorAngleToXAxis = (x: number, y: number) =>
  (Math.atan2(y, x) * 180) / Math.PI;

const test = () => {
  const x = 0;
  const y = 1;
  console.log(`Angle: ${getVectorAngleToXAxis(x, y)}`);
};
