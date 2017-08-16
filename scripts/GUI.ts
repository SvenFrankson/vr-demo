class GUI {
  public static iconWidth: number = 0.3;
  public static paintIconWidth: number = 0.15;
  public static iconHeight: number = 0.15;
  public static mainIconHeight: number = 0.3;
  public static iconAlphaZero: number = 0.28;
  public static iconAlpha: number = 0.175;
  public static iconBeta: number = 0.8;

  public static CreateGUI(): void {
    let buildIconsBeta: number = - GUI.iconBeta / 2;
    Main.moveIcon = new SmallIcon(
      "move-icon",
      VRMath.XAngleYAngle(0, - 3 * GUI.iconBeta / 2),
      Main.Camera,
      GUI.iconWidth,
      GUI.mainIconHeight,
      [""],
      () => {
        SmallIcon.UnLockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        Control.mode = 0;
      }
    );
    Main.buildIcon = new SmallIcon(
      "build-icon",
      VRMath.XAngleYAngle(0, buildIconsBeta),
      Main.Camera,
      GUI.iconWidth,
      GUI.mainIconHeight,
      [""],
      () => {
        SmallIcon.LockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.ShowClass("brick-cat");
        Control.mode = 5;
      }
    );
    Main.deleteIcon = new SmallIcon(
      "paint-icon",
      VRMath.XAngleYAngle(0, GUI.iconBeta / 2),
      Main.Camera,
      GUI.iconWidth,
      GUI.mainIconHeight,
      [""],
      () => {
        SmallIcon.LockCameraRotation();
        SmallIcon.ShowClass("paint-pick");
        Control.mode = 5;
      }
    );
    Main.deleteIcon = new SmallIcon(
      "delete-icon",
      VRMath.XAngleYAngle(0, 3 * GUI.iconBeta / 2),
      Main.Camera,
      GUI.iconWidth,
      GUI.mainIconHeight,
      [""],
      () => {
        SmallIcon.UnLockCameraRotation();
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        Control.mode = 2;
      }
    );
    new SmallIcon(
      "bricks/brick-s-bar",
      VRMath.XAngleYAngle(GUI.iconAlphaZero + 0 * GUI.iconAlpha, buildIconsBeta),
      Main.Camera,
      GUI.iconWidth,
      GUI.iconHeight,
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
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, buildIconsBeta),
          Main.Camera,
          GUI.iconWidth,
          GUI.iconHeight,
          ["brick-pick", "brick-s-bar"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-s-bar");
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
      VRMath.XAngleYAngle(GUI.iconAlphaZero + 1 * GUI.iconAlpha, buildIconsBeta),
      Main.Camera,
      GUI.iconWidth,
      GUI.iconHeight,
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
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, buildIconsBeta),
          Main.Camera,
          GUI.iconWidth,
          GUI.iconHeight,
          ["brick-pick", "brick-m-bar"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-m-bar");
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
      VRMath.XAngleYAngle(GUI.iconAlphaZero + 2 * GUI.iconAlpha, buildIconsBeta),
      Main.Camera,
      GUI.iconWidth,
      GUI.iconHeight,
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
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, buildIconsBeta),
          Main.Camera,
          GUI.iconWidth,
          GUI.iconHeight,
          ["brick-pick", "brick-s-brick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-s-brick");
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
      VRMath.XAngleYAngle(GUI.iconAlphaZero + 3 * GUI.iconAlpha, buildIconsBeta),
      Main.Camera,
      GUI.iconWidth,
      GUI.iconHeight,
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
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, buildIconsBeta),
          Main.Camera,
          GUI.iconWidth,
          GUI.iconHeight,
          ["brick-pick", "brick-m-brick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("brick-m-brick");
            Control.width = v;
            Control.height = 3;
            Control.length = 2;
            Control.mode = 1;
          }
        ).Hide();
      }
    );

    let paintIconBetaLeft: number = GUI.iconBeta / 2 - GUI.iconBeta / 7;
    let paintIconBetaRight: number = GUI.iconBeta / 2 + GUI.iconBeta / 7;
    [
      {name: "black", color: "232323"},
      {name: "red", color: "f45342"},
      {name: "green", color: "77f442"},
      {name: "blue", color: "42b0f4"}
    ].forEach(
      (
        c: {name: string, color: string},
        i: number
      ) => {
        new SmallIcon(
          "paint/" + c.name + "",
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, paintIconBetaLeft),
          Main.Camera,
          GUI.paintIconWidth,
          GUI.iconHeight,
          ["paint-pick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("paint-pick");
          }
        ).Hide();
      }
    );
    [
      {name: "white", color: "efefef"},
      {name: "yellow", color: "eef442"},
      {name: "purple", color: "c242f4"},
      {name: "orange", color: "f48c42"}
    ].forEach(
      (
        c: {name: string, color: string},
        i: number
      ) => {
        new SmallIcon(
          "paint/" + c.name + "",
          VRMath.XAngleYAngle(GUI.iconAlphaZero + i * GUI.iconAlpha, paintIconBetaRight),
          Main.Camera,
          GUI.paintIconWidth,
          GUI.iconHeight,
          ["paint-pick"],
          () => {
            SmallIcon.UnLockCameraRotation();
            SmallIcon.HideClass("paint-pick");
          }
        ).Hide();
      }
    );
  }
}
