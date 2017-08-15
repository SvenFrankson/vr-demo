/// <reference path="../lib/babylon.d.ts"/>

class Main {

  public static Canvas: HTMLCanvasElement;
  public static Engine: BABYLON.Engine;
  public static Scene: BABYLON.Scene;
  public static Camera: BABYLON.WebVRFreeCamera;
  public static Light: BABYLON.Light;

  public static moveIcon: Icon;
  public static buildIcon: Icon;
  public static deleteIcon: Icon;

  public static cursor: BABYLON.Mesh;

  constructor(canvasElement: string) {
    Main.Canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    Main.Engine = new BABYLON.Engine(Main.Canvas, true);
    Main.Engine.setHardwareScalingLevel(0.25);
  }

  CreateScene(): void {
    Main.Scene = new BABYLON.Scene(Main.Engine);
    Main.Scene.registerBeforeRender(Control.Update);

    if (navigator.getVRDisplays) {
      console.log("WebVR supported. Using babylonjs WebVRFreeCamera");
      Main.Camera = new BABYLON.WebVRFreeCamera(
        "VRCamera",
        new BABYLON.Vector3(Config.XMax * Config.XSize / 2, 2, Config.ZMax * Config.ZSize / 2),
        Main.Scene
      );
    } else {
      console.warn("WebVR not supported. Using babylonjs VRDeviceOrientationFreeCamera fallback");
    }
    Main.Camera.minZ = 0.2;
    Main.Canvas.onpointerup = () => {
      Main.Canvas.onpointerup = undefined;
       Main.Engine.switchFullscreen(true);
      Main.Camera.attachControl(Main.Canvas, true);
      Main.Canvas.onpointerdown = () => {
        Control.onPointerDown();
      };
      Main.Canvas.onpointerup = () => {
        Control.onPointerUp();
      };
    };

    Main.CreateCursor();
    Control.CreatePreviewBrick();

    Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
    Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
    Main.Light.specular = new BABYLON.Color3(1, 1, 1);

    // debug purpose only under this line
    let ground: BABYLON.Mesh = new BABYLON.Mesh("Ground", Main.Scene);
    BrickData.CubicalData(Config.XMax, 1, Config.ZMax).applyToMesh(ground);
    ground.position.y = -Config.YSize;
    let groundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("GroundMaterial", Main.Scene);
    groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#98f442");
    groundMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    let sIDistance: number = 1.6;
    let sIAlphaZero: number = Math.PI / 12;
    let sIAlpha: number = Math.PI / 20;
    let smallIconSize: number = 1;
    let smallIconOffset: number = 1.1;
    let smallIconDistance: number = 0.6;
    Main.moveIcon = new Icon(
      "move-icon",
      new BABYLON.Vector3(-0.7, -1.5, 0.4),
      Main.Camera,
      1,
      () => {
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        Control.mode = 0;
      }
    );
    Main.buildIcon = new Icon(
      "build-icon",
      new BABYLON.Vector3(0, -1.5, 0.6),
      Main.Camera,
      1,
      () => {
        SmallIcon.HideClass("brick-pick");
        SmallIcon.ShowClass("brick-cat");
        Control.mode = 4;
      }
    );
    new SmallIcon(
      "bricks/brick-s-bar",
      new BABYLON.Vector3(
        0,
        Math.cos(Math.PI / 2 - (sIAlphaZero + 0 * sIAlpha)) * sIDistance,
        2 * sIDistance * Math.sin((sIAlphaZero + 0 * sIAlpha) / 2) * Math.sin(sIAlphaZero + 0 * sIAlpha)
      ),
      Main.buildIcon,
      smallIconSize,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-s-bar");
      }
    );
    [1, 2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-1-1",
          new BABYLON.Vector3(0, smallIconOffset + i * smallIconDistance, 0),
          Main.buildIcon,
          smallIconSize,
          ["brick-pick", "brick-s-bar"],
          () => {
            SmallIcon.HideClass("brick-s-bar");
            Control.width = v;
            Control.height = 1;
            Control.length = 1;
            Control.mode = 1;
          }
        );
      }
    );
    new SmallIcon(
      "bricks/brick-m-bar",
      new BABYLON.Vector3(
        0,
        Math.cos(Math.PI / 2 - (sIAlphaZero + 1 * sIAlpha)) * sIDistance,
        2 * sIDistance * Math.sin((sIAlphaZero + 1 * sIAlpha) / 2) * Math.sin(sIAlphaZero + 1 * sIAlpha)
      ),
      Main.buildIcon,
      smallIconSize,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-m-bar");
      }
    );
    [1, 2, 4, 6, 8].forEach(
      (v: number, i: number) => {
      new SmallIcon(
          "bricks/brick-" + v + "-3-1",
          new BABYLON.Vector3(0, smallIconOffset + i * smallIconDistance, 0),
          Main.buildIcon,
          smallIconSize,
          ["brick-pick", "brick-m-bar"],
          () => {
            SmallIcon.HideClass("brick-m-bar");
            Control.width = v;
            Control.height = 3;
            Control.length = 1;
            Control.mode = 1;
          }
        );
      }
    );
    new SmallIcon(
      "bricks/brick-s-brick",
      new BABYLON.Vector3(
        0,
        Math.cos(Math.PI / 2 - (sIAlphaZero + 2 * sIAlpha)) * sIDistance,
        2 * sIDistance * Math.sin((sIAlphaZero + 2 * sIAlpha) / 2) * Math.sin(sIAlphaZero + 2 * sIAlpha)
      ),
      Main.buildIcon,
      smallIconSize,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-s-brick");
      }
    );
    [2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-1-2",
          new BABYLON.Vector3(0, smallIconOffset + i * smallIconDistance, 0),
          Main.buildIcon,
          smallIconSize,
          ["brick-pick", "brick-s-brick"],
          () => {
            SmallIcon.HideClass("brick-s-brick");
            Control.width = v;
            Control.height = 1;
            Control.length = 2;
            Control.mode = 1;
          }
        );
      }
    );
    new SmallIcon(
      "bricks/brick-m-brick",
      new BABYLON.Vector3(
        0,
        Math.cos(Math.PI / 2 - (sIAlphaZero + 3 * sIAlpha)) * sIDistance,
        2 * sIDistance * Math.sin((sIAlphaZero + 3 * sIAlpha) / 2) * Math.sin(sIAlphaZero + 3 * sIAlpha)
      ),
      Main.buildIcon,
      smallIconSize,
      ["brick-cat"],
      () => {
        SmallIcon.HideClass("brick-cat");
        SmallIcon.ShowClass("brick-m-brick");
      }
    );
    [2, 4, 6, 8].forEach(
      (v: number, i: number) => {
        new SmallIcon(
          "bricks/brick-" + v + "-3-2",
          new BABYLON.Vector3(0, smallIconOffset + i * smallIconDistance, 0),
          Main.buildIcon,
          smallIconSize,
          ["brick-pick", "brick-m-brick"],
          () => {
            SmallIcon.HideClass("brick-m-brick");
            Control.width = v;
            Control.height = 3;
            Control.length = 2;
            Control.mode = 1;
          }
        );
      }
    );
    Main.deleteIcon = new Icon(
      "delete-icon",
      new BABYLON.Vector3(0.7, -1.5, 0.4),
      Main.Camera,
      1,
      () => {
        SmallIcon.HideClass("brick-pick");
        SmallIcon.HideClass("brick-cat");
        Control.mode = 2;
      }
    );
  }

  public CreateDevShowBrickScene(): void {
    Main.Scene = new BABYLON.Scene(Main.Engine);
    Main.Scene.clearColor.copyFromFloats(1, 1, 1, 0.5);
    let arcRotateCamera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera(
      "ArcRotateCamera",
      0, 0, 1,
      BABYLON.Vector3.Zero(),
      Main.Scene
    );
    arcRotateCamera.setPosition(new BABYLON.Vector3(4, 3, -5));
    arcRotateCamera.attachControl(Main.Canvas);
    arcRotateCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    let cameraFrameSize: number = 4;
    arcRotateCamera.orthoTop = cameraFrameSize / 2;
    arcRotateCamera.orthoBottom = - cameraFrameSize / 2;
    arcRotateCamera.orthoLeft = - cameraFrameSize;
    arcRotateCamera.orthoRight = cameraFrameSize;
    let light: BABYLON.Light = new BABYLON.DirectionalLight("Light", new BABYLON.Vector3(-0.75, -1, 0.5), Main.Scene);
    light.intensity = 1.5;
    let brick6: PrettyBrick = new PrettyBrick(6, 3, 1, Main.Scene);
    brick6.position.z =Config.ZSize;
    let brick4: PrettyBrick = new PrettyBrick(4, 3, 1, Main.Scene);
    brick4.position.z = -Config.ZSize;
    brick4.position.x = -Config.XSize;
    let brick2: PrettyBrick = new PrettyBrick(2, 3, 1, Main.Scene);
    brick2.position.z = -Config.ZSize;
    brick2.position.x = 3 * Config.XSize;
  }

  public animate(): void {
    Main.Engine.runRenderLoop(() => {
      Main.Scene.render();
    });

    window.addEventListener("resize", () => {
      Main.Engine.resize();
    });
  }

  public static CreateCursor(): void {
    Main.cursor = BABYLON.MeshBuilder.CreateSphere("Cursor", {diameter: 0.4}, Main.Scene);
    Main.cursor.position.copyFromFloats(0, 0, 10);
    Main.cursor.parent = Main.Camera;
    let cursorMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("CursorMaterial", Main.Scene);
    cursorMaterial.diffuseColor.copyFromFloats(0, 0, 0);
    cursorMaterial.specularColor.copyFromFloats(0, 0, 0);
    cursorMaterial.emissiveColor.copyFromFloats(1, 1, 1);
    Main.cursor.material = cursorMaterial;
    Main.cursor.renderOutline = true;
    Main.cursor.outlineColor.copyFromFloats(0, 0, 0);
    Main.cursor.outlineWidth = 0.05;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game : Main = new Main("render-canvas");
  game.CreateScene();
  game.animate();
});
