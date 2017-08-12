class Brick extends BABYLON.Mesh {
    constructor(coordinates) {
        console.log("Add new Brick at " + coordinates.x + " " + coordinates.y + " " + coordinates.z);
        super("Brick", Main.Scene);
        BrickData.CubicalData(1, 3, 1).applyToMesh(this);
        this.position = Brick.BrickCoordinatesToWorldPos(coordinates);
        this.freezeWorldMatrix();
        Brick.instances.push(this);
    }
    static WorldPosToBrickCoordinates(worldPosition) {
        let coordinates = BABYLON.Vector3.Zero();
        coordinates.x = Math.round(worldPosition.x / Config.XSize);
        coordinates.y = Math.round(worldPosition.y / Config.YSize);
        coordinates.z = Math.round(worldPosition.z / Config.ZSize);
        return coordinates;
    }
    static BrickCoordinatesToWorldPos(coordinates) {
        let worldPosition = BABYLON.Vector3.Zero();
        worldPosition.x = coordinates.x * Config.XSize;
        worldPosition.y = coordinates.y * Config.YSize;
        worldPosition.z = coordinates.z * Config.ZSize;
        return worldPosition;
    }
    Hightlight(color) {
        this.renderOutline = true;
        this.outlineColor.copyFrom(color);
        this.outlineWidth = 0.02;
    }
    Unlit() {
        this.outlineColor.copyFromFloats(0, 0, 0);
    }
    static UnlitAll() {
        Brick.instances.forEach((i) => {
            i.Unlit();
        });
    }
}
Brick.instances = [];
class BrickData {
    static VertexDataFromJSON(jsonData) {
        let tmp = JSON.parse(jsonData);
        let vertexData = new BABYLON.VertexData();
        vertexData.positions = tmp.positions;
        vertexData.normals = tmp.normals;
        for (let i = 0; i < vertexData.normals.length; i++) {
            vertexData.positions[i] = vertexData.positions[i] / 100.0;
            vertexData.normals[i] = vertexData.normals[i] / 100.0;
        }
        vertexData.indices = tmp.indices;
        return vertexData;
    }
    static CubicalData(width, height, length) {
        let cubeData = new BABYLON.VertexData();
        let vertices = new Array();
        let positions = new Array();
        let indices = new Array();
        vertices[0] = new Array(-0.5, -0.5, -0.5);
        vertices[1] = new Array(-0.5 + width, -0.5, -0.5);
        vertices[2] = new Array(-0.5 + width, -0.5, -0.5 + length);
        vertices[3] = new Array(-0.5, -0.5, -0.5 + length);
        vertices[4] = new Array(-0.5, -0.5 + height, -0.5);
        vertices[5] = new Array(-0.5 + width, -0.5 + height, -0.5);
        vertices[6] = new Array(-0.5 + width, -0.5 + height, -0.5 + length);
        vertices[7] = new Array(-0.5, -0.5 + height, -0.5 + length);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] * Config.XSize;
            vertices[i][1] = vertices[i][1] * Config.YSize;
            vertices[i][2] = vertices[i][2] * Config.ZSize;
        }
        BrickData.PushQuad(vertices, 0, 1, 2, 3, positions, indices);
        BrickData.PushQuad(vertices, 1, 5, 6, 2, positions, indices);
        BrickData.PushQuad(vertices, 5, 4, 7, 6, positions, indices);
        BrickData.PushQuad(vertices, 0, 4, 5, 1, positions, indices);
        BrickData.PushQuad(vertices, 3, 7, 4, 0, positions, indices);
        BrickData.PushQuad(vertices, 2, 6, 7, 3, positions, indices);
        for (let i = 0; i < width; i++) {
            for (let k = 0; k < length; k++) {
                BrickData.PushSlot(i, height - 1, k, positions, indices);
            }
        }
        let normals = new Array();
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        cubeData.positions = positions;
        cubeData.indices = indices;
        cubeData.normals = normals;
        return cubeData;
    }
    static SlideData(width, height, length) {
        let slideData = new BABYLON.VertexData();
        let vertices = new Array();
        let positions = new Array();
        let indices = new Array();
        vertices[0] = new Array(-0.5, -0.5, -0.5);
        vertices[1] = new Array(-0.5 + width / 2, -0.5, -0.5);
        vertices[2] = new Array(-0.5 + width / 2, -0.5, -0.5 + length);
        vertices[3] = new Array(-0.5, -0.5, -0.5 + length);
        vertices[4] = new Array(-0.5, -0.5 + height, -0.5);
        vertices[5] = new Array(-0.5 + width / 2, -0.5 + height, -0.5);
        vertices[6] = new Array(-0.5 + width / 2, -0.5 + height, -0.5 + length);
        vertices[7] = new Array(-0.5, -0.5 + height, -0.5 + length);
        vertices[8] = new Array(-0.5 + width, -0.5, -0.5);
        vertices[9] = new Array(-0.5 + width, -0.5, -0.5 + length);
        vertices[10] = new Array(-0.5 + width, 0.5, -0.5);
        vertices[11] = new Array(-0.5 + width, 0.5, -0.5 + length);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] * Config.XSize;
            vertices[i][1] = vertices[i][1] * Config.YSize;
            vertices[i][2] = vertices[i][2] * Config.ZSize;
        }
        BrickData.PushQuad(vertices, 0, 1, 2, 3, positions, indices);
        BrickData.PushQuad(vertices, 5, 4, 7, 6, positions, indices);
        BrickData.PushQuad(vertices, 0, 4, 5, 1, positions, indices);
        BrickData.PushQuad(vertices, 3, 7, 4, 0, positions, indices);
        BrickData.PushQuad(vertices, 2, 6, 7, 3, positions, indices);
        BrickData.PushQuad(vertices, 8, 10, 11, 9, positions, indices);
        BrickData.PushQuad(vertices, 5, 6, 11, 10, positions, indices);
        BrickData.PushQuad(vertices, 1, 8, 9, 2, positions, indices);
        BrickData.PushQuad(vertices, 1, 5, 10, 8, positions, indices);
        BrickData.PushQuad(vertices, 9, 11, 6, 2, positions, indices);
        for (let i = 0; i < width / 2; i++) {
            for (let k = 0; k < length; k++) {
                BrickData.PushSlot(i, height - 1, k, positions, indices);
            }
        }
        let normals = new Array();
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        slideData.positions = positions;
        slideData.indices = indices;
        slideData.normals = normals;
        return slideData;
    }
    static GroundData() {
        let cubeData = new BABYLON.VertexData();
        let vertices = new Array();
        let positions = new Array();
        let indices = new Array();
        vertices[0] = new Array(-10.5, -0.5, -10.5);
        vertices[1] = new Array(10.5, -0.5, -10.5);
        vertices[2] = new Array(10.5, -0.5, 10.5);
        vertices[3] = new Array(-10.5, -0.5, 10.5);
        vertices[4] = new Array(-10.5, 0.5, -10.5);
        vertices[5] = new Array(10.5, 0.5, -10.5);
        vertices[6] = new Array(10.5, 0.5, 10.5);
        vertices[7] = new Array(-10.5, 0.5, 10.5);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = vertices[i][0] * Config.XSize;
            vertices[i][1] = vertices[i][1] * Config.YSize;
            vertices[i][2] = vertices[i][2] * Config.ZSize;
        }
        BrickData.PushQuad(vertices, 0, 1, 2, 3, positions, indices);
        BrickData.PushQuad(vertices, 1, 5, 6, 2, positions, indices);
        BrickData.PushQuad(vertices, 5, 4, 7, 6, positions, indices);
        BrickData.PushQuad(vertices, 0, 4, 5, 1, positions, indices);
        BrickData.PushQuad(vertices, 3, 7, 4, 0, positions, indices);
        BrickData.PushQuad(vertices, 2, 6, 7, 3, positions, indices);
        for (let i = -10; i <= 10; i++) {
            for (let k = -10; k <= 10; k++) {
                BrickData.PushSlot(i, 0, k, positions, indices);
            }
        }
        let normals = new Array();
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        cubeData.positions = positions;
        cubeData.indices = indices;
        cubeData.normals = normals;
        return cubeData;
    }
    static PushSlot(x, y, z, positions, indices) {
        let vertices = new Array();
        vertices[0] = new Array(-0.1, 0.5, -0.25);
        vertices[1] = new Array(0.1, 0.5, -0.25);
        vertices[2] = new Array(0.25, 0.5, -0.1);
        vertices[3] = new Array(0.25, 0.5, 0.1);
        vertices[4] = new Array(0.1, 0.5, 0.25);
        vertices[5] = new Array(-0.1, 0.5, 0.25);
        vertices[6] = new Array(-0.25, 0.5, 0.1);
        vertices[7] = new Array(-0.25, 0.5, -0.1);
        vertices[8] = new Array(-0.1, 1.1, -0.25);
        vertices[9] = new Array(0.1, 1.1, -0.25);
        vertices[10] = new Array(0.25, 1.1, -0.1);
        vertices[11] = new Array(0.25, 1.1, 0.1);
        vertices[12] = new Array(0.1, 1.1, 0.25);
        vertices[13] = new Array(-0.1, 1.1, 0.25);
        vertices[14] = new Array(-0.25, 1.1, 0.1);
        vertices[15] = new Array(-0.25, 1.1, -0.1);
        vertices[16] = new Array(0, 1.1, 0);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] = (vertices[i][0] + x) * Config.XSize;
            vertices[i][1] = (vertices[i][1] + y) * Config.YSize;
            vertices[i][2] = (vertices[i][2] + z) * Config.ZSize;
        }
        BrickData.PushQuad(vertices, 0, 8, 9, 1, positions, indices);
        BrickData.PushQuad(vertices, 1, 9, 10, 2, positions, indices);
        BrickData.PushQuad(vertices, 2, 10, 11, 3, positions, indices);
        BrickData.PushQuad(vertices, 3, 11, 12, 4, positions, indices);
        BrickData.PushQuad(vertices, 4, 12, 13, 5, positions, indices);
        BrickData.PushQuad(vertices, 5, 13, 14, 6, positions, indices);
        BrickData.PushQuad(vertices, 6, 14, 15, 7, positions, indices);
        BrickData.PushQuad(vertices, 7, 15, 8, 0, positions, indices);
        BrickData.PushTriangle(vertices, 8, 9, 16, positions, indices);
        BrickData.PushTriangle(vertices, 9, 10, 16, positions, indices);
        BrickData.PushTriangle(vertices, 10, 11, 16, positions, indices);
        BrickData.PushTriangle(vertices, 11, 12, 16, positions, indices);
        BrickData.PushTriangle(vertices, 12, 13, 16, positions, indices);
        BrickData.PushTriangle(vertices, 13, 14, 16, positions, indices);
        BrickData.PushTriangle(vertices, 14, 15, 16, positions, indices);
        BrickData.PushTriangle(vertices, 15, 8, 16, positions, indices);
    }
    static PushTriangle(vertices, a, b, c, positions, indices) {
        let index = positions.length / 3;
        for (let n in vertices[a]) {
            if (vertices[a] != null) {
                positions.push(vertices[a][n]);
            }
        }
        for (let n in vertices[b]) {
            if (vertices[b] != null) {
                positions.push(vertices[b][n]);
            }
        }
        for (let n in vertices[c]) {
            if (vertices[c] != null) {
                positions.push(vertices[c][n]);
            }
        }
        indices.push(index);
        indices.push(index + 1);
        indices.push(index + 2);
    }
    static PushQuad(vertices, a, b, c, d, positions, indices) {
        let index = positions.length / 3;
        for (let n in vertices[a]) {
            if (vertices[a] != null) {
                positions.push(vertices[a][n]);
            }
        }
        for (let n in vertices[b]) {
            if (vertices[b] != null) {
                positions.push(vertices[b][n]);
            }
        }
        for (let n in vertices[c]) {
            if (vertices[c] != null) {
                positions.push(vertices[c][n]);
            }
        }
        for (let n in vertices[d]) {
            if (vertices[d] != null) {
                positions.push(vertices[d][n]);
            }
        }
        indices.push(index);
        indices.push(index + 2);
        indices.push(index + 1);
        indices.push(index + 3);
        indices.push(index + 2);
        indices.push(index);
    }
}
class Config {
}
Config.XSize = 0.7;
Config.YSize = 0.3;
Config.ZSize = 0.7;
Config.XMax = 32;
Config.YMax = 32;
Config.ZMax = 32;
class Control {
    static get mode() {
        return Control._mode;
    }
    static set mode(v) {
        Control._mode = v;
        if (Control.mode === 1) {
            Control.previewBrick.isVisible = true;
        }
        else {
            Control.previewBrick.isVisible = false;
        }
    }
    static onPointerDown() {
        let t = (new Date()).getTime();
        if ((t - Control._lastPointerDownTime) < Control.DOUBLEPOINTERDELAY) {
            Control._lastPointerDownTime = t;
            return this.onDoublePointerDown();
        }
        Control._lastPointerDownTime = t;
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return mesh !== Main.cursor && mesh !== Control.previewBrick; });
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
                let correctedPickPoint = BABYLON.Vector3.Zero();
                correctedPickPoint.copyFrom(pick.pickedPoint.add(pick.getNormal().scale(0.1)));
                let coordinates = Brick.WorldPosToBrickCoordinates(correctedPickPoint);
                let newBrick = new Brick(coordinates);
                let brickMaterial = new BABYLON.StandardMaterial("BrickMaterial", Main.Scene);
                brickMaterial.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
                brickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
                newBrick.material = brickMaterial;
            }
        }
        if (Control.mode === 2) {
            if (pick.hit) {
                if (pick.pickedMesh instanceof Brick) {
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
        Control.previewBrick.isVisible = false;
        Icon.UnlitAll();
        Brick.UnlitAll();
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return mesh !== Main.cursor && mesh !== Control.previewBrick; });
        if (pick.hit) {
            Control._meshAimed = pick.pickedMesh;
            if (Control._meshAimed.parent instanceof Icon) {
                Control._meshAimed.parent.Hightlight();
            }
            else {
                if (Control._meshAimed instanceof Brick) {
                    if (Control.mode === 1) {
                        Control._meshAimed.Hightlight(BABYLON.Color3.White());
                    }
                    if (Control.mode === 2) {
                        Control._meshAimed.Hightlight(BABYLON.Color3.Red());
                    }
                }
                if (Control.mode === 1) {
                    let correctedPickPoint = BABYLON.Vector3.Zero();
                    correctedPickPoint.copyFrom(pick.pickedPoint.add(pick.getNormal().scale(0.1)));
                    Control.previewBrick.isVisible = true;
                    Control.previewBrick.position = Brick.BrickCoordinatesToWorldPos(Brick.WorldPosToBrickCoordinates(correctedPickPoint));
                }
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
    static CreatePreviewBrick() {
        Control.previewBrick = new BABYLON.Mesh("PreviewBrick", Main.Scene);
        Control.previewBrick.isPickable = false;
        BrickData.CubicalData(1, 3, 1).applyToMesh(Control.previewBrick);
        let previewBrickMaterial = new BABYLON.StandardMaterial("PreviewBrickMaterial", Main.Scene);
        previewBrickMaterial.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
        previewBrickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        previewBrickMaterial.alpha = 0.5;
        Control.previewBrick.material = previewBrickMaterial;
    }
}
Control.DOUBLEPOINTERDELAY = 500;
Control._lastPointerDownTime = 0;
Control._cameraSpeed = 0;
Control._mode = 0;
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
        Main.Engine.setHardwareScalingLevel(0.5);
    }
    createScene() {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        if (navigator.getVRDisplays) {
            console.log("WebVR supported. Using babylonjs WebVRFreeCamera");
            Main.Camera = new BABYLON.WebVRFreeCamera("VRCamera", new BABYLON.Vector3(Config.XMax * Config.XSize / 2, 2, Config.ZMax * Config.ZSize / 2), Main.Scene);
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
        Main.CreateCursor();
        Control.CreatePreviewBrick();
        Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
        Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
        Main.Light.specular = new BABYLON.Color3(1, 1, 1);
        let ground = new BABYLON.Mesh("Ground", Main.Scene);
        BrickData.CubicalData(Config.XMax, 1, Config.ZMax).applyToMesh(ground);
        ground.position.y = -Config.YSize;
        let groundMaterial = new BABYLON.StandardMaterial("GroundMaterial", Main.Scene);
        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#98f442");
        groundMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        ground.material = groundMaterial;
        Main.moveIcon = new Icon("move-icon", new BABYLON.Vector3(-0.7, -1.5, 0.4), Main.Camera, 0.5, () => {
            Control.mode = 0;
        });
        Main.buildIcon = new Icon("build-icon", new BABYLON.Vector3(0, -1.5, 0.6), Main.Camera, 0.5, () => {
            Control.mode = 1;
        });
        Main.deleteIcon = new Icon("delete-icon", new BABYLON.Vector3(0.7, -1.5, 0.4), Main.Camera, 0.5, () => {
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
    static CreateCursor() {
        Main.cursor = BABYLON.MeshBuilder.CreateSphere("Cursor", { diameter: 0.4 }, Main.Scene);
        Main.cursor.position.copyFromFloats(0, 0, 10);
        Main.cursor.parent = Main.Camera;
        let cursorMaterial = new BABYLON.StandardMaterial("CursorMaterial", Main.Scene);
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
