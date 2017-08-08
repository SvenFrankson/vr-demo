class Interact {
  private static _camForward = BABYLON.Vector3.Zero();

  public static ButtonDown(): void {
    BABYLON.Vector3.TransformNormalToRef(BABYLON.Axis.Z, Main.Camera.getWorldMatrix(), Interact._camForward);
    let ray: BABYLON.Ray = new BABYLON.Ray(Main.Camera.position, Interact._camForward);
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      (mesh: BABYLON.Mesh) => {
        return true;
      }
    );
    if (pick.hit) {
      let ball: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("Ball", {diameter: 0.5}, Main.Scene);
      let ballMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("BallMaterial", Main.Scene);
      ballMat.diffuseColor.copyFromFloats(
        Math.random(),
        Math.random(),
        Math.random()
      );
      ball.material = ballMat;
      ball.position = pick.pickedPoint;
    }
  }
}
