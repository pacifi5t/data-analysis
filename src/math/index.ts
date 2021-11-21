export {
  mean,
  median,
  stdDev,
  shiftedStdDev,
  skewnessCoef1,
  skewnessCoef2,
  kurtosisCoef1,
  kurtosisCoef2,
  antikurtosisCoef
} from "./characteristics";

export {
  meanConfInterval,
  medianConfInterval,
  stdDevConfInterval,
  coefConfInterval
} from "./confidence-intervals";

export {
  meanDeviation,
  stdDevDeviation,
  skewnessDeviation1,
  skewnessDeviation2,
  kurtosisDeviation1,
  kurtosisDeviation2
} from "./deviations";

export {
  normDistribQuan,
  studentDistribQuan,
  pearsonDistribQuan
} from "./quantiles";

export {
  mu,
  sigma,
  muDispersion,
  sigmaDispersion,
  muConfInterval,
  sigmaConfInterval
} from "./parameters";

export {
  min,
  max,
  quartile1,
  quartile3,
  aproxLaplace,
  pearsonFunction,
  pearsonCriteria,
  hiSquare
} from "./other";
