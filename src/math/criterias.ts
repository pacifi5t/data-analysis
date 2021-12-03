import { jStat } from "jstat";
import { alpha, fisherDistribQuan, mean, stdDev } from ".";

export function dispersionEquality(arrX, arrY) {
  const f =
    Math.pow(stdDev(arrX, mean(arrX)), 2) /
    Math.pow(stdDev(arrY, mean(arrY)), 2);
  const v1 = arrX.length - 1;
  const v2 = arrY.length - 1;
  const fisher = jStat.ftest(f, v1, v2);
  const p = 2 * (f <= 1 ? fisher : 1 - fisher);

  // const f1 = fisherDistribQuan(alpha / 2, v1, v2);
  // const f2 = fisherDistribQuan(1 - alpha / 2, v1, v2);

  return p >= alpha;
}
