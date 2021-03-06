class GUI {
  public static cameraGUIMatrix: BABYLON.Matrix = BABYLON.Matrix.Identity();
  public static iconWidth: number = 0.3;
  public static paintIconWidth: number = 0.15;
  public static iconHeight: number = 0.15;
  public static mainIconHeight: number = 0.3;
  public static iconAlphaZero: number = 0.28;
  public static iconAlpha: number = 0.175;
  public static iconBeta: number = 0.8;

  private static _cameraForward: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private static _alphaCam: number = 0;
  public static UpdateCameraGUIMatrix(): void {
    GUI._cameraForward = Main.Camera.getForwardRay().direction;
    GUI._alphaCam = VRMath.AngleFromToAround(BABYLON.Axis.Z, GUI._cameraForward, BABYLON.Axis.Y);
    let rotationQuaternion: BABYLON.Quaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, GUI._alphaCam);
    BABYLON.Matrix.ComposeToRef(
      BABYLON.Vector3.One(),
      rotationQuaternion,
      Main.Camera.position,
      GUI.cameraGUIMatrix
    );
  }

  public static CreateGUI(): void {
    Main.moveIcon = new SmallIcon(
      "move-icon",
      "L0",
      Main.Camera,
      [""],
      () => {
        SmallIcon.UnLockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("paint-pick");
        SmallIcon.HideClass("brick-cat");
        SmallIcon.HideClass("brick-rotate");
        Control.mode = 0;
      }
    );
    Main.buildIcon = new SmallIcon(
      "build-icon",
      "L1",
      Main.Camera,
      [""],
      () => {
        SmallIcon.LockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("paint-pick");
        SmallIcon.ShowClass("brick-cat");
        SmallIcon.HideClass("brick-rotate");
        Control.mode = 5;
      }
    );
    Main.deleteIcon = new SmallIcon(
      "paint-icon",
      "L2",
      Main.Camera,
      [""],
      () => {
        SmallIcon.LockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("paint-pick");
        SmallIcon.HideClass("brick-rotate");
        Control.mode = 5;
      }
    );
    Main.deleteIcon = new SmallIcon(
      "delete-icon",
      "L3",
      Main.Camera,
      [""],
      () => {
        SmallIcon.UnLockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        SmallIcon.HideClass("paint-pick");
        SmallIcon.HideClass("brick-rotate");
        Control.mode = 2;
      }
    );
    new SmallIcon(
      "bricks/brick-s-bar",
      "M0",
      Main.Camera,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-s-bar");
      }
    ).Hide();
    [1, 2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-1-1",
          "M" + i,
          Main.Camera,
          ["brick-pick", "brick-s-bar"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-s-bar");
            SmallIcon.ShowClass("brick-rotate");
            Control.width = v;
            Control.height = 1;
            Control.length = 1;
            Control.mode = 1;
          }
        ).Hide();
      }
    );
    new SmallIcon(
      "bricks/brick-m-bar",
      "M1",
      Main.Camera,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-m-bar");
      }
    ).Hide();
    [1, 2, 4, 6, 8].forEach(
      (v: number, i: number) => {
      new SmallIcon(
          "bricks/brick-" + v + "-3-1",
          "M" + i,
          Main.Camera,
          ["brick-pick", "brick-m-bar"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-m-bar");
            SmallIcon.ShowClass("brick-rotate");
            Control.width = v;
            Control.height = 3;
            Control.length = 1;
            Control.mode = 1;
          }
        ).Hide();
      }
    );
    new SmallIcon(
      "bricks/brick-s-brick",
      "M2",
      Main.Camera,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-s-brick");
      }
    ).Hide();
    [2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-1-2",
          "M" + i,
          Main.Camera,
          ["brick-pick", "brick-s-brick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-s-brick");
            SmallIcon.ShowClass("brick-rotate");
            Control.width = v;
            Control.height = 1;
            Control.length = 2;
            Control.mode = 1;
          }
        ).Hide();
      }
    );
    new SmallIcon(
      "bricks/brick-m-brick",
      "M3",
      Main.Camera,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-m-brick");
      }
    ).Hide();
    [2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-3-2",
          "M" + i,
          Main.Camera,
          ["brick-pick", "brick-m-brick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-m-brick");
            SmallIcon.ShowClass("brick-rotate");
            Control.width = v;
            Control.height = 3;
            Control.length = 2;
            Control.mode = 1;
          }
        ).Hide();
      }
    );
    new SmallIcon(
      "rotate-left",
      "S10",
      Main.Camera,
      ["brick-rotate"],
      () => {
        Control.rotation --;
      }
    ).Hide();
    new SmallIcon(
      "rotate-right",
      "S11",
      Main.Camera,
      ["brick-rotate"],
      () => {
        Control.rotation ++;
      }
    ).Hide();
    [
      {name: "black", color: "#232323"},
      {name: "red", color: "#f45342"},
      {name: "green", color: "#77f442"},
      {name: "blue", color: "#42b0f4"}
    ].forEach(
      (
        c: {name: string, color: string},
        i: number
      ) => {
        new SmallIcon(
          "paint/" + c.name + "",
          "S" + i,
          Main.Camera,
          ["paint-pick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("paint-pick");
            Control.color = c.color;
            Control.mode = 4;
          }
        ).Hide();
      }
    );
    [
      {name: "white", color: "#efefef"},
      {name: "yellow", color: "#eef442"},
      {name: "purple", color: "#c242f4"},
      {name: "orange", color: "#f48c42"}
    ].forEach(
      (
        c: {name: string, color: string},
        i: number
      ) => {
        new SmallIcon(
          "paint/" + c.name + "",
          "S" + (4 + i),
          Main.Camera,
          ["paint-pick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("paint-pick");
            Control.color = c.color;
            Control.mode = 4;
          }
        ).Hide();
      }
    );
  }
}
