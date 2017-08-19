class VRMath {

  public static IsNanOrZero(n: number): boolean {
    return isNaN(n) || n === 0;
  }

  public static ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, ref: BABYLON.Vector3): void {
    if (v && at) {
      let k: number = BABYLON.Vector3.Dot(v, at);
      k = k / at.lengthSquared();
      if (isFinite(k)) {
        ref.copyFrom(v);
        ref.subtractInPlace(at.scale(k));
      }
    }
  }

  public static ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3 {
    let out: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    VRMath.ProjectPerpendicularAtToRef(v, at, out);
    return out;
  }

  public static Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number {
    return Math.acos(BABYLON.Vector3.Dot(from, to) / from.length() / to.length());
  }

  public static AngleFromToAround(
    from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3, onlyPositive: boolean = false
  ): number {
    let pFrom: BABYLON.Vector3 = VRMath.ProjectPerpendicularAt(from, around).normalize();
    if (VRMath.IsNanOrZero(pFrom.lengthSquared())) {
      return NaN;
    }
    let pTo: BABYLON.Vector3 = VRMath.ProjectPerpendicularAt(to, around).normalize();
    if (VRMath.IsNanOrZero(pTo.lengthSquared())) {
      return NaN;
    }
    let angle: number = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
    if (BABYLON.Vector3.Dot(BABYLON.Vector3.Cross(pFrom, pTo), around) < 0) {
      if (onlyPositive) {
        angle = 2 * Math.PI - angle;
      } else {
        angle = -angle;
      }
    }
    return angle;
  }

  public static XAngleYAngle(x: number, y: number): BABYLON.Vector3 {
    let vector: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 1);
    let xMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationX(-x);
    let yMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationY(y);
    let globalMatrix: BABYLON.Matrix = BABYLON.Matrix.RotationX(5 * Math.PI / 16);
    BABYLON.Vector3.TransformNormalToRef(vector, globalMatrix, vector);
    BABYLON.Vector3.TransformNormalToRef(vector, xMatrix, vector);
    BABYLON.Vector3.TransformNormalToRef(vector, yMatrix, vector);
    return vector;
  }

  public static RotateVector3(v: BABYLON.Vector3, orientation: number): BABYLON.Vector3 {
    if (orientation === 0) {
      return v;
    } else if (orientation === 1) {
      return new BABYLON.Vector3(v.z, v.y, -v.x);
    } else if (orientation === 2) {
      return new BABYLON.Vector3(-v.x, v.y, -v.z);
    } else if (orientation === 3) {
      return new BABYLON.Vector3(-v.z, v.y, v.x);
    }
  }
}
