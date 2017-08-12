class Control {
    static onPointerDown() {
        let t = (new Date()).getTime();
        if ((t - Control._lastPointerDownTime) < Control.DOUBLEPOINTERDELAY) {
            Control._lastPointerDownTime = t;
            return this.onDoublePointerDown();
        }
        Control._lastPointerDownTime = t;
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return true; });
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
                let newBox = BABYLON.MeshBuilder.CreateBox("New", 1, Main.Scene);
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
    static onPointerUp() {
        Control._cameraSpeed = 0;
    }
    static onDoublePointerDown() {
        if (Control.mode === 0) {
            Control._cameraSpeed = -0.05;
        }
    }
    static Update() {
        Icon.UnlitAll();
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return true; });
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
    static UpdateModeMove() {
        if (Control._cameraSpeed !== 0) {
            let move = Main.Camera.getForwardRay().direction;
            move.scaleInPlace(Control._cameraSpeed);
            Main.Camera.position.addInPlace(move);
            Main.Camera.position.y = Math.max(Main.Camera.position.y, 2);
        }
    }
}
Control.DOUBLEPOINTERDELAY = 500;
Control._lastPointerDownTime = 0;
Control._cameraSpeed = 0;
Control.mode = 0;
class Icon extends BABYLON.Mesh {
    constructor(picture, position, camera, scale = 1, onActivate = () => { return; }) {
        super(picture, camera.getScene());
        this.localPosition = BABYLON.Vector3.Zero();
        this._cameraForward = BABYLON.Vector3.Zero();
        this._targetPosition = BABYLON.Vector3.Zero();
        this._worldishMatrix = BABYLON.Matrix.Identity();
        this._alphaCam = 0;
        this.localPosition.copyFrom(position);
        this.camera = camera;
        this.rotation.copyFromFloats(0, 0, 0);
        this.scaling.copyFromFloats(scale, scale, scale);
        this.onActivate = onActivate;
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
        Icon.instances.push(this);
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
                    if (mesh.name.indexOf("Icon") !== -1) {
                        Icon.iconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                    }
                    else if (mesh.name.indexOf("Frame") !== -1) {
                        Icon.iconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                        if (mesh.material instanceof BABYLON.MultiMaterial) {
                            Icon.iconFrameMaterial = mesh.material;
                        }
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
        let iconMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
        iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
        iconMaterial.diffuseTexture.hasAlpha = true;
        iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        icon.material = iconMaterial;
        this.frame = new BABYLON.Mesh(this.name + "-frame", this.getScene());
        Icon.iconFrameMeshData.applyToMesh(this.frame);
        this.frame.position.copyFromFloats(0, 0, 0);
        this.frame.parent = this;
        let frameMaterial = new BABYLON.StandardMaterial(this.name + "-frame-mat", this.getScene());
        frameMaterial.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
        frameMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        this.frame.material = frameMaterial;
        console.log("Icon " + this.name + " initialized.");
    }
    Hightlight() {
        if (this.frame) {
            this.frame.renderOutline = true;
            this.frame.outlineColor = BABYLON.Color3.White();
            this.frame.outlineWidth = 0.02;
        }
    }
    Unlit() {
        if (this.frame) {
            this.frame.renderOutline = false;
        }
    }
    static UnlitAll() {
        Icon.instances.forEach((i) => {
            i.Unlit();
        });
    }
    UpdatePosition() {
        this._cameraForward = this.camera.getForwardRay().direction;
        if (this._cameraForward.y > -0.3) {
            this._alphaCam = VRMath.AngleFromToAround(BABYLON.Axis.Z, this._cameraForward, BABYLON.Axis.Y);
        }
        let rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, this._alphaCam);
        BABYLON.Matrix.ComposeToRef(BABYLON.Vector3.One(), rotationQuaternion, this.camera.position, this._worldishMatrix);
        BABYLON.Vector3.TransformCoordinatesToRef(this.localPosition, this._worldishMatrix, this._targetPosition);
        if (isNaN(this._targetPosition.x)) {
            return;
        }
        BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.05, this.position);
        this.lookAt(this.camera.position, 0, Math.PI, Math.PI);
    }
}
Icon.instances = [];
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
            Main.Camera = new BABYLON.WebVRFreeCamera("VRCamera", new BABYLON.Vector3(0, 2, 0), Main.Scene);
        }
        else {
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
        Main.moveIcon = new Icon("move-icon", new BABYLON.Vector3(-0.7, -1.5, 0.7), Main.Camera, 0.5, () => {
            Control.mode = 0;
        });
        Main.buildIcon = new Icon("build-icon", new BABYLON.Vector3(0, -1.5, 1), Main.Camera, 0.5, () => {
            Control.mode = 1;
        });
        Main.deleteIcon = new Icon("delete-icon", new BABYLON.Vector3(0.7, -1.5, 0.7), Main.Camera, 0.5, () => {
            Control.mode = 2;
        });
    }
    animate() {
        Main.Engine.runRenderLoop(() => {
            Control.Update();
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
class VRMath {
    static ProjectPerpendicularAt(v, at) {
        let p = BABYLON.Vector3.Zero();
        let k = (v.x * at.x + v.y * at.y + v.z * at.z);
        k = k / (at.x * at.x + at.y * at.y + at.z * at.z);
        p.copyFrom(v);
        p.subtractInPlace(at.multiplyByFloats(k, k, k));
        return p;
    }
    static Angle(from, to) {
        let pFrom = BABYLON.Vector3.Normalize(from);
        let pTo = BABYLON.Vector3.Normalize(to);
        let angle = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
        return angle;
    }
    static AngleFromToAround(from, to, around) {
        let pFrom = VRMath.ProjectPerpendicularAt(from, around).normalize();
        let pTo = VRMath.ProjectPerpendicularAt(to, around).normalize();
        let angle = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
        if (BABYLON.Vector3.Dot(BABYLON.Vector3.Cross(pFrom, pTo), around) < 0) {
            angle = -angle;
        }
        return angle;
    }
}
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
