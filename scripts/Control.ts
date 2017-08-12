class Control {
  private static DOUBLEPOINTERDELAY: number = 500;
  private static _lastPointerDownTime: number = 0;
  private static _cameraSpeed: number = 0;
  public static mode: number = 0;

  public static onPointerDown(): void {
    let t: number = (new Date()).getTime();
    if ((t - Control._lastPointerDownTime) < Control.DOUBLEPOINTERDELAY) {
      Control._lastPointerDownTime = t;
      return this.onDoublePointerDown();
    }
    Control._lastPointerDownTime = t;

    let ray: BABYLON.Ray = Main.Camera.getForwardRay();
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      (mesh: BABYLON.Mesh) => {return true;}
    );
    if (pick.hit) {
      Control._meshAimed = pick.pickedMesh;
      if (Control._meshAimed.parent instanceof Icon) {
        Control._meshAimed.parent.onActivate();
        return;
      }
    }
    if (Control.mode === 0) {
      Control._cameraSpeed = 0.05;
    }
    if (Control.mode === 1) {
      if (pick.hit) {
        let newBox: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("New", 1, Main.Scene);
        newBox.position.copyFrom(pick.pickedPoint);
        newBox.position.x = Math.round(newBox.position.x);
        newBox.position.y = Math.round(newBox.position.y);
        newBox.position.z = Math.round(newBox.position.z);
      }
    }
    if (Control.mode === 2) {
      if (pick.hit) {
        if (pick.pickedMesh) {
          pick.pickedMesh.dispose();
        }
      }
    }
  }

  public static onPointerUp(): void {
    Control._cameraSpeed = 0;
  }

  public static onDoublePointerDown(): void {
    if (Control.mode === 0) {
      Control._cameraSpeed = -0.05;
    }
  }

  private static _meshAimed: BABYLON.AbstractMesh;
  public static Update(): void {
    Icon.UnlitAll();
    let ray: BABYLON.Ray = Main.Camera.getForwardRay();
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      (mesh: BABYLON.Mesh) => {return true;}
    );
    if (pick.hit) {
      Control._meshAimed = pick.pickedMesh;
      if (Control._meshAimed.parent instanceof Icon) {
        Control._meshAimed.parent.Hightlight();
      }
    }
    if (Control.mode === 0) {
      Control.UpdateModeMove();
    }
  }

  private static UpdateModeMove(): void {
    if (Control._cameraSpeed !== 0) {
      let move: BABYLON.Vector3 = Main.Camera.getForwardRay().direction;
      move.scaleInPlace(Control._cameraSpeed);
      Main.Camera.position.addInPlace(move);
      Main.Camera.position.y = Math.max(Main.Camera.position.y, 2);
    }
  }
}
