/// <reference path="../lib/babylon.d.ts"/>

class Main {

  public static Canvas: HTMLCanvasElement;
  public static Engine: BABYLON.Engine;
  public static Scene: BABYLON.Scene;
  public static Camera: BABYLON.VRDeviceOrientationFreeCamera;
  public static Light: BABYLON.Light;

  public static neCube: BABYLON.Mesh;
  public static nwCube: BABYLON.Mesh;
  public static seCube: BABYLON.Mesh;
  public static swCube: BABYLON.Mesh;

  constructor(canvasElement: string) {
    Main.Canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    Main.Engine = new BABYLON.Engine(Main.Canvas, true);
  }

  createScene(): void {
    Main.Scene = new BABYLON.Scene(Main.Engine);

    Main.Camera = new BABYLON.VRDeviceOrientationFreeCamera(
      "VRCamera",
      new BABYLON.Vector3(0, 1.5, 0),
      Main.Scene,
      true
    );
    Main.Camera.attachControl(Main.Canvas);

    Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
    Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
    Main.Light.specular = new BABYLON.Color3(1, 1, 1);

    // debug purpose only under this line
    let ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround("Ground", {width: 10, height: 10}, Main.Scene);
    let groundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("GroundMaterial", Main.Scene);
    groundMaterial.specularColor.copyFromFloats(0, 0, 0);
    ground.material = groundMaterial;

    Main.neCube = BABYLON.MeshBuilder.CreateBox("NECube", 1, Main.Scene);
    Main.neCube.position.copyFromFloats(4.5, 0.5, 4.5);
    Main.neCube.material = new BABYLON.StandardMaterial("NECubeMaterial", Main.Scene);

    Main.nwCube = BABYLON.MeshBuilder.CreateBox("NWCube", 1, Main.Scene);
    Main.nwCube.position.copyFromFloats(-4.5, 0.5, 4.5);
    Main.nwCube.material = new BABYLON.StandardMaterial("NWCubeMaterial", Main.Scene);

    Main.seCube = BABYLON.MeshBuilder.CreateBox("SECube", 1, Main.Scene);
    Main.seCube.position.copyFromFloats(4.5, 0.5, -4.5);
    Main.seCube.material = new BABYLON.StandardMaterial("SECubeMaterial", Main.Scene);

    Main.swCube = BABYLON.MeshBuilder.CreateBox("SWCube", 1, Main.Scene);
    Main.swCube.position.copyFromFloats(-4.5, 0.5, -4.5);
    Main.swCube.material = new BABYLON.StandardMaterial("SWCubeMaterial", Main.Scene);
  }

  public animate(): void {
    Main.Engine.runRenderLoop(() => {
      Main.Scene.render();
    });

    window.addEventListener("resize", () => {
      Main.Engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game : Main = new Main("render-canvas");
  game.createScene();
  game.animate();

  Main.Canvas.addEventListener("touchstart", (event: TouchEvent) => {
    Interact.ButtonDown();
  });

  Main.Canvas.addEventListener("touchend", (event: Event) => {
    Utils.RequestFullscreen();
    if (Main.neCube.material instanceof BABYLON.StandardMaterial) {
      Main.neCube.material.diffuseColor.copyFromFloats(
        Math.random(),
        Math.random(),
        Math.random()
      );
    }
    if (Main.nwCube.material instanceof BABYLON.StandardMaterial) {
      Main.nwCube.material.diffuseColor.copyFromFloats(
        Math.random(),
        Math.random(),
        Math.random()
      );
    }
    if (Main.seCube.material instanceof BABYLON.StandardMaterial) {
      Main.seCube.material.diffuseColor.copyFromFloats(
        Math.random(),
        Math.random(),
        Math.random()
      );
    }
    if (Main.swCube.material instanceof BABYLON.StandardMaterial) {
      Main.swCube.material.diffuseColor.copyFromFloats(
        Math.random(),
        Math.random(),
        Math.random()
      );
    }
  });
});
