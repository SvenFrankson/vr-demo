/// <reference path="../lib/babylon.d.ts"/>
/// <reference path="../lib/jquery.d.ts"/>

class Main {

  public static Canvas: HTMLCanvasElement;
  public static Engine: BABYLON.Engine;
  public static Scene: BABYLON.Scene;
  public static Camera: BABYLON.WebVRFreeCamera;
  public static Light: BABYLON.Light;

  public static moveIcon: SmallIcon;
  public static buildIcon: SmallIcon;
  public static deleteIcon: SmallIcon;

  public static cursor: BABYLON.Mesh;

  public static currentSave: string = "save1";

  constructor(canvasElement: string) {
    Main.Canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    Main.Engine = new BABYLON.Engine(Main.Canvas, true, {limitDeviceRatio: 0.25}, true);
  }

  CreateScene(): void {
    $("canvas").show();
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
      console.log("WebVR not supported. Using babylonjs WebVRFreeCamera");
    }
    Main.Camera.minZ = 0.2;
    Main.Engine.switchFullscreen(true);
    Main.Engine.resize();
    Main.Camera.attachControl(Main.Canvas, true);
    Main.Canvas.onpointerdown = () => {
      Control.onPointerDown();
    };
    Main.Canvas.onpointerup = () => {
      Control.onPointerUp();
    };

    Main.CreateCursor();
    Control.CreatePreviewBrick();

    Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
    Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
    Main.Light.specular = new BABYLON.Color3(1, 1, 1);

    let ground: BABYLON.Mesh = new BABYLON.Mesh("Ground", Main.Scene);
    BrickData.CubicalData(Config.XMax, 1, Config.ZMax).applyToMesh(ground);
    ground.position.y = -Config.YSize;
    let groundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("GroundMaterial", Main.Scene);
    groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#98f442");
    groundMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    IconLoader.LoadIcons(GUI.CreateGUI);

    SaveManager.Load();

    setTimeout(
      () => {
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Welcome to VR Brick Builder !");
      },
      1000
    );
    setTimeout(
      () => {
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Welcome to VR Brick Builder !");
      },
      1000
    );

    Main.Scene.registerBeforeRender(GUI.UpdateCameraGUIMatrix);
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
    Main.cursor.renderingGroupId = 1;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  $("#cardboard-main-icon").on("click", () => {
    let game : Main = new Main("render-canvas");
    game.CreateScene();
    game.animate();
  });
});

$(document).on(
  "webkitfullscreenchange mozfullscreenchange fullscreenchange",
  (e) => {
    if (!!Main.Engine.isFullscreen) {
      // location.reload();
    }
  }
);
