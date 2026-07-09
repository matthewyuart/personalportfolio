/* =====================================================================
 * HyperCycles — geometric drawing engine
 * ---------------------------------------------------------------------
 * A HyperCycle is a "spirograph inside a spirograph": several spirograph
 * stages nested so that each stage's pen point carries the *next* stage's
 * ring. Every nested stage adds another rotating vector at a new frequency,
 * which is the "additional periodicity" John Edmark's HyperCycles describe.
 *
 * Math model
 * ----------
 * A single classic spirograph (hypotrochoid): a gear of radius r rolls
 * inside a ring of radius R, with a pen offset of (d * r) from the gear
 * center. Its pen traces the sum of two rotating vectors ("arms"):
 *
 *    carrier arm:  amplitude (R - r),  angular frequency  +1
 *    pen arm:      amplitude (d * r),  angular frequency  -(R - r)/r
 *
 *    P(t) = (R-r)[cos t, sin t] + d*r[cos(-rho*t), sin(-rho*t)]
 *           with rho = (R - r) / r
 *
 * which is exactly the standard hypotrochoid.
 *
 * Nesting: stage i+1's ring is mounted on stage i's pen point and spins
 * with stage i's gear. So we accumulate the parent gear's rotation rate
 * (Omega) into the child's frequencies. Each stage contributes a carrier
 * arm and a pen arm; the very last pen arm holds the drawing pen.
 *
 *    P(t) = sum_k  A_k * [cos(f_k * t + phi_k), sin(f_k * t + phi_k)]
 *
 * Because every f_k is rational (derived from integer tooth counts), the
 * curve closes after a finite number of revolutions = lcm of the reduced
 * frequency denominators. That is computed exactly with fractions.
 * ===================================================================== */

(function (global) {
  'use strict';

  // ---- exact rational arithmetic (for closure detection) -------------
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }
  function lcm(a, b) { return Math.abs(a / gcd(a, b) * b); }

  function frac(num, den) {
    if (den < 0) { num = -num; den = -den; }
    var g = gcd(num, den);
    return { n: num / g, d: den / g };
  }
  function fAdd(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fSub(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }

  /**
   * Convert nested spirograph stages into a flat list of rotating arms.
   * @param stages array of { R, r, d, phase } (outer -> inner)
   *   R     ring tooth count (integer)
   *   r     gear tooth count (integer, < R)
   *   d     pen offset as a fraction 0..1 of the gear radius
   *   phase starting phase offset in radians (optional)
   * @returns array of { amp, freq, phase, freqFrac }
   */
  function stagesToArms(stages) {
    var arms = [];
    var Omega = frac(0, 1); // accumulated rotation rate of the current ring frame
    for (var i = 0; i < stages.length; i++) {
      var s = stages[i];
      var R = s.R, r = s.r, d = (s.d == null ? 0.7 : s.d), phase = s.phase || 0;
      var rho = frac(R - r, r);
      var carrierFreq = fAdd(Omega, frac(1, 1));
      var gearFreq = fSub(Omega, rho);

      arms.push({
        amp: (R - r),
        freq: carrierFreq.n / carrierFreq.d,
        freqFrac: carrierFreq,
        phase: phase
      });
      arms.push({
        amp: d * r,
        freq: gearFreq.n / gearFreq.d,
        freqFrac: gearFreq,
        phase: phase
      });

      Omega = gearFreq; // the next stage's ring rides on this gear's disk
    }
    return arms;
  }

  /** Smallest integer number of master revolutions after which the curve closes. */
  function closureRevolutions(arms) {
    var N = 1;
    for (var i = 0; i < arms.length; i++) {
      var den = arms[i].freqFrac ? arms[i].freqFrac.d : 1;
      N = lcm(N, den);
      if (N > 100000) return null; // effectively non-closing within reason
    }
    return N;
  }

  /** Joint positions of every arm tip at master angle t (last point = pen). */
  function joints(arms, t) {
    var pts = [{ x: 0, y: 0 }];
    var x = 0, y = 0;
    for (var i = 0; i < arms.length; i++) {
      var a = arms[i];
      x += a.amp * Math.cos(a.freq * t + a.phase);
      y += a.amp * Math.sin(a.freq * t + a.phase);
      pts.push({ x: x, y: y });
    }
    return pts;
  }

  /** Pen position at master angle t. */
  function penAt(arms, t) {
    var x = 0, y = 0;
    for (var i = 0; i < arms.length; i++) {
      var a = arms[i];
      x += a.amp * Math.cos(a.freq * t + a.phase);
      y += a.amp * Math.sin(a.freq * t + a.phase);
    }
    return { x: x, y: y };
  }

  /** Maximum possible distance of the pen from the origin (for autoscaling). */
  function maxRadius(arms) {
    var sum = 0;
    for (var i = 0; i < arms.length; i++) sum += Math.abs(arms[i].amp);
    return sum || 1;
  }

  /**
   * Sample the full curve.
   * @param arms     from stagesToArms
   * @param opts     { samplesPerRev, maxRevolutions, maxPoints }
   * @returns { points:[{x,y}], revolutions, closed, tMax }
   */
  function sampleCurve(arms, opts) {
    opts = opts || {};
    var perRev = opts.samplesPerRev || 360;
    var maxPoints = opts.maxPoints || 400000;

    var closeRev = closureRevolutions(arms);
    var closed = closeRev != null;
    var revolutions = closed ? closeRev : (opts.maxRevolutions || 200);

    var steps = Math.min(maxPoints, Math.max(perRev, Math.ceil(revolutions * perRev)));
    var tMax = 2 * Math.PI * revolutions;

    var points = new Array(steps + 1);
    for (var i = 0; i <= steps; i++) {
      var t = tMax * (i / steps);
      points[i] = penAt(arms, t);
    }
    return { points: points, revolutions: revolutions, closed: closed, tMax: tMax };
  }

  global.HCEngine = {
    stagesToArms: stagesToArms,
    closureRevolutions: closureRevolutions,
    sampleCurve: sampleCurve,
    joints: joints,
    penAt: penAt,
    maxRadius: maxRadius
  };
})(window);
