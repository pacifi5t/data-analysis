export function normDistribQuan(p: number) {
  function phi(x: number) {
    const t = Math.sqrt(-2 * Math.log(x));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.1892659;
    const d3 = 0.001308;
    return (
      t -
      (c0 + c1 * t + c2 * t * t) /
        (1 + d1 * t + d2 * t * t + d3 * Math.pow(t, 3))
    );
  }

  return p <= 0.5 ? -phi(p) : phi(1 - p);
}

export function studentDistribQuan(p: number, classCount: number) {
  const v = classCount - 1;
  function g1(u: number) {
    return (Math.pow(u, 3) + u) / 4;
  }

  function g2(u: number) {
    return (5 * Math.pow(u, 5) + 16 * Math.pow(u, 3) + 3 * u) / 96;
  }

  function g3(u: number) {
    return (
      (3 * Math.pow(u, 7) +
        19 * Math.pow(u, 5) +
        17 * Math.pow(u, 3) -
        15 * u) /
      384
    );
  }

  function g4(u: number) {
    return (
      (79 * Math.pow(u, 9) +
        779 * Math.pow(u, 7) +
        1482 * Math.pow(u, 5) -
        1920 * Math.pow(u, 3) -
        945 * u) /
      92160
    );
  }

  const u = normDistribQuan(p);
  return (
    u +
    g1(u) / v +
    g2(u) / Math.pow(v, 2) +
    g3(u) / Math.pow(v, 3) +
    g4(u) / Math.pow(v, 4)
  );
}

export function pearsonDistribQuan(p: number, v: number) {
  return (
    v *
    Math.pow(1 - 2 / (9 * v) + normDistribQuan(p) * Math.sqrt(2 / (9 * v)), 3)
  );
}
