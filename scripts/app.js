class Interact {
    static ButtonDown() {
        BABYLON.Vector3.TransformNormalToRef(BABYLON.Axis.Z, Main.Camera.getWorldMatrix(), Interact._camForward);
        let ray = new BABYLON.Ray(Main.Camera.position, Interact._camForward);
        let pick = Main.Scene.pickWithRay(ray, (mesh) => {
            return true;
        });
        if (pick.hit) {
            let ball = BABYLON.MeshBuilder.CreateSphere("Ball", { diameter: 0.5 }, Main.Scene);
            let ballMat = new BABYLON.StandardMaterial("BallMaterial", Main.Scene);
            ballMat.diffuseColor.copyFromFloats(Math.random(), Math.random(), Math.random());
            ball.material = ballMat;
            ball.position = pick.pickedPoint;
        }
    }
}
Interact._camForward = BABYLON.Vector3.Zero();
class Main {
    constructor(canvasElement) {
        Main.Canvas = document.getElementById(canvasElement);
        Main.Engine = new BABYLON.Engine(Main.Canvas, true);
    }
    createScene() {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        Main.Camera = new BABYLON.VRDeviceOrientationFreeCamera("VRCamera", new BABYLON.Vector3(0, 1.5, 0), Main.Scene, true);
        Main.Camera.attachControl(Main.Canvas);
        Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
        Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
        Main.Light.specular = new BABYLON.Color3(1, 1, 1);
        let ground = BABYLON.MeshBuilder.CreateGround("Ground", { width: 10, height: 10 }, Main.Scene);
        let groundMaterial = new BABYLON.StandardMaterial("GroundMaterial", Main.Scene);
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
    animate() {
        Main.Engine.runRenderLoop(() => {
            Main.Scene.render();
        });
        window.addEventListener("resize", () => {
            Main.Engine.resize();
        });
    }
}
window.addEventListener("DOMContentLoaded", () => {
    let game = new Main("render-canvas");
    game.createScene();
    game.animate();
    Main.Canvas.addEventListener("touchstart", (event) => {
        Interact.ButtonDown();
    });
    Main.Canvas.addEventListener("touchend", (event) => {
        Utils.RequestFullscreen();
        if (Main.neCube.material instanceof BABYLON.StandardMaterial) {
            Main.neCube.material.diffuseColor.copyFromFloats(Math.random(), Math.random(), Math.random());
        }
        if (Main.nwCube.material instanceof BABYLON.StandardMaterial) {
            Main.nwCube.material.diffuseColor.copyFromFloats(Math.random(), Math.random(), Math.random());
        }
        if (Main.seCube.material instanceof BABYLON.StandardMaterial) {
            Main.seCube.material.diffuseColor.copyFromFloats(Math.random(), Math.random(), Math.random());
        }
        if (Main.swCube.material instanceof BABYLON.StandardMaterial) {
            Main.swCube.material.diffuseColor.copyFromFloats(Math.random(), Math.random(), Math.random());
        }
    });
});
class Utils {
    static RequestFullscreen() {
        if (Main.Canvas.requestFullscreen) {
            Main.Canvas.requestFullscreen();
        }
        else if (Main.Canvas.webkitRequestFullscreen) {
            Main.Canvas.webkitRequestFullscreen();
        }
        if (screen.orientation.lock) {
            screen.orientation.lock("landscape");
        }
        Main.Engine.resize();
    }
}
