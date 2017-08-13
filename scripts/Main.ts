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
    Main.Engine.setHardwareScalingLevel(0.5);
  }

  createScene(): void {
    Main.Scene = new BABYLON.Scene(Main.Engine);

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

    Main.moveIcon = new Icon(
      "move-icon",
      new BABYLON.Vector3(-0.7, -1.5, 0.4),
      Main.Camera,
      0.5,
      () => {
        Control.mode = 0;
      }
    );
    Main.buildIcon = new Icon(
      "build-icon",
      new BABYLON.Vector3(0, -1.5, 0.6),
      Main.Camera,
      0.5,
      () => {
        Main.buildIcon.ShowSmallIcons();
        Control.mode = 4;
      }
    );
    Main.buildIcon.AddSmallIcon(new SmallIcon(
      "flat-brick",
      new BABYLON.Vector3(0, 1.2, 0),
      Main.buildIcon,
      1,
      () => {
        Main.buildIcon.HideSmallIcons();
        Control.width = 1;
        Control.height = 1;
        Control.length = 1;
        Control.mode = 1;
      }
    ));
    Main.buildIcon.AddSmallIcon(new SmallIcon(
      "long-brick",
      new BABYLON.Vector3(0, 2.2, 0),
      Main.buildIcon,
      1,
      () => {
        Main.buildIcon.HideSmallIcons();
        Control.width = 2;
        Control.height = 3;
        Control.length = 1;
        Control.mode = 1;
      }
    ));
    Main.buildIcon.AddSmallIcon(new SmallIcon(
      "large-brick",
      new BABYLON.Vector3(0, 3.2, 0),
      Main.buildIcon,
      1,
      () => {
        Main.buildIcon.HideSmallIcons();
        Control.width = 4;
        Control.height = 3;
        Control.length = 2;
        Control.mode = 1;
      }
    ));
    Main.deleteIcon = new Icon(
      "delete-icon",
      new BABYLON.Vector3(0.7, -1.5, 0.4),
      Main.Camera,
      0.5,
      () => {
        Control.mode = 2;
      }
    );
  }

  public animate(): void {
    Main.Engine.runRenderLoop(() => {
      Control.Update();
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
  game.createScene();
  game.animate();
});
