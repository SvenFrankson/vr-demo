class Icon extends BABYLON.Mesh {
    constructor(picture, position, camera, scale = 1) {
        super(picture, camera.getScene());
        this.localPosition = BABYLON.Vector3.Zero();
        this._targetPosition = BABYLON.Vector3.Zero();
        this.localPosition.copyFrom(position);
        this.camera = camera;
        this.rotation.copyFromFloats(0, Math.PI, 0);
        if (Icon.iconMeshData && Icon.iconFrameMeshData) {
            this.Initialize();
        }
        else {
            Icon.LoadIconFrameData(camera.getScene());
            Icon.onIconFrameDataLoaded.push(() => {
                this.Initialize();
            });
        }
        camera.getScene().registerBeforeRender(() => {
            this.UpdatePosition();
        });
    }
    static LoadIconFrameData(scene) {
        if (Icon.iconFrameDataLoading) {
            return;
        }
        Icon.iconFrameDataLoading = true;
        BABYLON.SceneLoader.ImportMesh("", "./datas/icon-base.babylon", "", scene, (meshes) => {
            console.log("IconMeshData loaded");
            for (let i = 0; i < meshes.length; i++) {
                if (meshes[i] instanceof BABYLON.Mesh) {
                    let mesh = meshes[i];
                    if (mesh.name.indexOf("Icon")) {
                        Icon.iconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                    }
                    else if (mesh.name.indexOf("Frame")) {
                        Icon.iconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                    }
                    mesh.dispose();
                }
            }
            for (let i = 0; i < Icon.onIconFrameDataLoaded.length; i++) {
                Icon.onIconFrameDataLoaded[i]();
            }
        });
    }
    Initialize() {
        console.log("Icon " + this.name + " initializing...");
        let icon = new BABYLON.Mesh(this.name + "-icon", this.getScene());
        Icon.iconMeshData.applyToMesh(icon);
        icon.position.copyFromFloats(0, 0, 0);
        icon.parent = this;
        let frame = new BABYLON.Mesh(this.name + "-frame", this.getScene());
        Icon.iconFrameMeshData.applyToMesh(frame);
        frame.position.copyFromFloats(0, 0, 0);
        frame.parent = this;
        console.log("Icon " + this.name + " initialized.");
    }
    UpdatePosition() {
        this._targetPosition.copyFrom(this.camera.position);
        this._targetPosition.addInPlace(this.localPosition);
        BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.1, this.position);
    }
}
Icon.onIconFrameDataLoaded = [];
Icon.iconFrameDataLoading = false;
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
        if (navigator.getVRDisplays) {
            console.log("WebVR supported. Using babylonjs WebVRFreeCamera");
            Main.Camera = new BABYLON.WebVRFreeCamera("VRCamera", new BABYLON.Vector3(0, 1.5, 0), Main.Scene);
        }
        else {
            console.warn("WebVR not supported. Using babylonjs VRDeviceOrientationFreeCamera fallback");
            Main.Camera = new BABYLON.VRDeviceOrientationFreeCamera("VRCamera", new BABYLON.Vector3(0, 1.5, 0), Main.Scene);
        }
        Main.Camera.minZ = 0.2;
        Main.Canvas.ontouchend = () => {
            Main.Canvas.ontouchend = undefined;
            Main.Engine.switchFullscreen(true);
            Main.Camera.attachControl(Main.Canvas, true);
            Main.Canvas.ontouchstart = () => {
                Main.forward = true;
            };
            Main.Canvas.ontouchend = () => {
                Main.forward = false;
            };
        };
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
        Main.neCube.scaling.y = 5;
        Main.nwCube = BABYLON.MeshBuilder.CreateBox("NWCube", 1, Main.Scene);
        Main.nwCube.position.copyFromFloats(-4.5, 0.5, 4.5);
        Main.nwCube.material = new BABYLON.StandardMaterial("NWCubeMaterial", Main.Scene);
        Main.seCube = BABYLON.MeshBuilder.CreateBox("SECube", 1, Main.Scene);
        Main.seCube.position.copyFromFloats(4.5, 0.5, -4.5);
        Main.seCube.material = new BABYLON.StandardMaterial("SECubeMaterial", Main.Scene);
        Main.swCube = BABYLON.MeshBuilder.CreateBox("SWCube", 1, Main.Scene);
        Main.swCube.position.copyFromFloats(-4.5, 0.5, -4.5);
        Main.swCube.material = new BABYLON.StandardMaterial("SWCubeMaterial", Main.Scene);
        Main.walkIcon = new Icon("walk-icon", new BABYLON.Vector3(-1, -1, 1), Main.Camera);
        Main.buildIcon = new Icon("build-icon", new BABYLON.Vector3(0, -1, 2), Main.Camera);
        Main.deleteIcon = new Icon("delete-icon", new BABYLON.Vector3(1, -1, 1), Main.Camera);
    }
    animate() {
        Main.Engine.runRenderLoop(() => {
            if (Main.forward) {
                Main.Camera.position.z += 0.01;
            }
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
});
class Utils {
    static RequestFullscreen() {
        if (Main.Canvas.requestFullscreen) {
            Main.Canvas.requestFullscreen();
        }
        else if (Main.Canvas.webkitRequestFullscreen) {
            Main.Canvas.webkitRequestFullscreen();
        }
        Main.Engine.resize();
    }
}
