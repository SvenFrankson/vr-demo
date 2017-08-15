class Brick extends BABYLON.Mesh {
    constructor(c, width, height, length) {
        console.log("Add new Brick at " + c.x + " " + c.y + " " + c.z);
        super("Brick", Main.Scene);
        BrickData.CubicalData(width, height, length).applyToMesh(this);
        this.position = Brick.BrickCoordinatesToWorldPos(c);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                for (let k = 0; k < length; k++) {
                    Brick.Occupy(c.add(new BABYLON.Vector3(i, j, k)));
                }
            }
        }
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
    static IsOccupied(c) {
        if (Brick.grid[c.x] === undefined) {
            return false;
        }
        if (Brick.grid[c.x][c.y] === undefined) {
            return false;
        }
        if (Brick.grid[c.x][c.y][c.z] === true) {
            return true;
        }
        return false;
    }
    static Occupy(c) {
        if (Brick.grid[c.x] === undefined) {
            Brick.grid[c.x] = [];
        }
        if (Brick.grid[c.x][c.y] === undefined) {
            Brick.grid[c.x][c.y] = [];
        }
        Brick.grid[c.x][c.y][c.z] = true;
    }
    static TryAdd(c, width, height, length) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                for (let k = 0; k < length; k++) {
                    if (Brick.IsOccupied(c.add(new BABYLON.Vector3(i, j, k)))) {
                        return undefined;
                    }
                }
            }
        }
        let brick = new Brick(c, width, height, length);
        return brick;
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
Brick.grid = [];
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
    static get width() {
        return this._width;
    }
    static set width(v) {
        this._width = v;
        BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
    }
    static get height() {
        return this._height;
    }
    static set height(v) {
        this._height = v;
        BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
    }
    static get length() {
        return this._length;
    }
    static set length(v) {
        this._length = v;
        BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
    }
    static onPointerDown() {
        let t = (new Date()).getTime();
        if ((t - Control._lastPointerDownTime) < Control.DOUBLEPOINTERDELAY) {
            Control._lastPointerDownTime = t;
            return this.onDoublePointerDown();
        }
        Control._lastPointerDownTime = t;
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return mesh !== Main.cursor && mesh !== Control.previewBrick && mesh.isVisible; });
        if (pick.hit) {
            Control._meshAimed = pick.pickedMesh;
            if (Control._meshAimed.parent instanceof Icon ||
                Control._meshAimed.parent instanceof SmallIcon) {
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
                let newBrick = Brick.TryAdd(coordinates, this.width, this.height, this.length);
                if (newBrick) {
                    let brickMaterial = new BABYLON.StandardMaterial("BrickMaterial", Main.Scene);
                    brickMaterial.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
                    brickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
                    newBrick.material = brickMaterial;
                }
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
        SmallIcon.UnlitAll();
        Brick.UnlitAll();
        let ray = Main.Camera.getForwardRay();
        let pick = Main.Scene.pickWithRay(ray, (mesh) => { return mesh !== Main.cursor && mesh !== Control.previewBrick && mesh.isVisible; });
        if (pick.hit) {
            Control._meshAimed = pick.pickedMesh;
            if (Control._meshAimed.parent instanceof Icon ||
                Control._meshAimed.parent instanceof SmallIcon) {
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
Control._width = 1;
Control._height = 1;
Control._length = 1;
class Icon extends BABYLON.Mesh {
    constructor(picture, position, camera, scale = 1, onActivate = () => { return; }) {
        super(picture, camera.getScene());
        this.localPosition = BABYLON.Vector3.Zero();
        this.smallIcons = [];
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
                    }
                    mesh.dispose();
                }
            }
            Icon.iconFrameMaterial = new BABYLON.StandardMaterial("IconFrameMaterial", scene);
            Icon.iconFrameMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/frame-icon.png", scene);
            Icon.iconFrameMaterial.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
            Icon.iconFrameMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
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
        this.frame.material = Icon.iconFrameMaterial;
        console.log("Icon " + this.name + " initialized.");
    }
    AddSmallIcon(smallIcon) {
        this.smallIcons.push(smallIcon);
    }
    ShowSmallIcons() {
        for (let i = 0; i < this.smallIcons.length; i++) {
            let smallIcon = this.smallIcons[i];
            for (let j = 0; j < smallIcon.getChildMeshes().length; j++) {
                smallIcon.getChildMeshes()[j].isVisible = true;
            }
        }
    }
    HideSmallIcons() {
        for (let i = 0; i < this.smallIcons.length; i++) {
            let smallIcon = this.smallIcons[i];
            for (let j = 0; j < smallIcon.getChildMeshes().length; j++) {
                smallIcon.getChildMeshes()[j].isVisible = false;
            }
        }
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
        Main.Engine.setHardwareScalingLevel(0.25);
    }
    CreateScene() {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        Main.Scene.registerBeforeRender(Control.Update);
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
            Main.buildIcon.ShowSmallIcons();
            Control.mode = 4;
        });
        Main.buildIcon.AddSmallIcon(new SmallIcon("flat-brick", new BABYLON.Vector3(0, 1.2, 0), Main.buildIcon, 1, () => {
            Main.buildIcon.HideSmallIcons();
            Control.width = 1;
            Control.height = 1;
            Control.length = 1;
            Control.mode = 1;
        }));
        Main.buildIcon.AddSmallIcon(new SmallIcon("long-brick", new BABYLON.Vector3(0, 2.2, 0), Main.buildIcon, 1, () => {
            Main.buildIcon.HideSmallIcons();
            Control.width = 2;
            Control.height = 3;
            Control.length = 1;
            Control.mode = 1;
        }));
        Main.buildIcon.AddSmallIcon(new SmallIcon("large-brick", new BABYLON.Vector3(0, 3.2, 0), Main.buildIcon, 1, () => {
            Main.buildIcon.HideSmallIcons();
            Control.width = 4;
            Control.height = 3;
            Control.length = 2;
            Control.mode = 1;
        }));
        Main.deleteIcon = new Icon("delete-icon", new BABYLON.Vector3(0.7, -1.5, 0.4), Main.Camera, 0.5, () => {
            Control.mode = 2;
        });
    }
    CreateDevShowBrickScene() {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        Main.Scene.clearColor.copyFromFloats(1, 1, 1, 0.5);
        let arcRotateCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 1, BABYLON.Vector3.Zero(), Main.Scene);
        arcRotateCamera.setPosition(new BABYLON.Vector3(4, 3, -5));
        arcRotateCamera.attachControl(Main.Canvas);
        arcRotateCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        let cameraFrameSize = 3;
        arcRotateCamera.orthoTop = cameraFrameSize / 2;
        arcRotateCamera.orthoBottom = -cameraFrameSize / 2;
        arcRotateCamera.orthoLeft = -cameraFrameSize;
        arcRotateCamera.orthoRight = cameraFrameSize;
        let light = new BABYLON.DirectionalLight("Light", new BABYLON.Vector3(-0.75, -1, 0.5), Main.Scene);
        light.intensity = 1.5;
        let brick = new PrettyBrick(8, 3, 2, Main.Scene);
        let brickMaterial = new BABYLON.StandardMaterial("DevShowBrickMaterial", Main.Scene);
        brickMaterial.diffuseColor.copyFromFloats(1, 1, 1);
        brickMaterial.specularColor.copyFromFloats(0, 0, 0);
        brick.material = brickMaterial;
    }
    animate() {
        Main.Engine.runRenderLoop(() => {
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
    game.CreateScene();
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
class PrettyBrick extends BABYLON.Mesh {
    constructor(width, height, length, scene) {
        super("PrettyBrick", scene);
        let box = BABYLON.MeshBuilder.CreateBox("Box", {
            width: width * Config.XSize,
            height: height * Config.YSize,
            depth: length * Config.ZSize
        }, scene);
        box.renderOutline = true;
        box.outlineColor.copyFromFloats(0, 0, 0);
        box.outlineWidth = 0.05;
        box.parent = this;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
                let plot = BABYLON.MeshBuilder.CreateCylinder("Plot", {
                    height: Config.YSize / 2,
                    diameter: Config.XSize / 2
                }, scene);
                plot.position.x = i * Config.XSize + Config.XSize / 2 - width * Config.XSize / 2;
                plot.position.y = height * Config.YSize - height * Config.YSize / 2 + Config.YSize / 4;
                plot.position.z = j * Config.ZSize + Config.ZSize / 2 - length * Config.ZSize / 2;
                plot.renderOutline = true;
                plot.outlineColor.copyFromFloats(0, 0, 0);
                plot.outlineWidth = 0.05;
                plot.parent = this;
            }
        }
    }
}
class SmallIcon extends BABYLON.Mesh {
    constructor(picture, position, parent, scale = 1, onActivate = () => { return; }) {
        super(picture, parent.getScene());
        this.position.copyFrom(position);
        this.parent = parent;
        this.rotation.copyFromFloats(0, 0, 0);
        this.scaling.copyFromFloats(scale, scale, scale);
        this.onActivate = onActivate;
        if (SmallIcon.smallIconMeshData && SmallIcon.smallIconFrameMeshData) {
            this.Initialize();
        }
        else {
            SmallIcon.LoadSmallIconFrameData(parent.getScene());
            SmallIcon.onSmallIconFrameDataLoaded.push(() => {
                this.Initialize();
            });
        }
        SmallIcon.instances.push(this);
    }
    static LoadSmallIconFrameData(scene) {
        if (SmallIcon.smallIconFrameDataLoading) {
            return;
        }
        SmallIcon.smallIconFrameDataLoading = true;
        BABYLON.SceneLoader.ImportMesh("", "./datas/small-icon-base.babylon", "", scene, (meshes) => {
            console.log("smallIconMeshData loaded");
            for (let i = 0; i < meshes.length; i++) {
                if (meshes[i] instanceof BABYLON.Mesh) {
                    let mesh = meshes[i];
                    if (mesh.name.indexOf("Icon") !== -1) {
                        SmallIcon.smallIconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                    }
                    else if (mesh.name.indexOf("Frame") !== -1) {
                        SmallIcon.smallIconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
                    }
                    mesh.dispose();
                }
            }
            SmallIcon.smallIconFrameMaterial = new BABYLON.StandardMaterial("IconFrameMaterial", scene);
            SmallIcon.smallIconFrameMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/frame-small-icon.png", scene);
            SmallIcon.smallIconFrameMaterial.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
            SmallIcon.smallIconFrameMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
            for (let i = 0; i < SmallIcon.onSmallIconFrameDataLoaded.length; i++) {
                SmallIcon.onSmallIconFrameDataLoaded[i]();
            }
        });
    }
    Initialize() {
        console.log("Icon " + this.name + " initializing...");
        let icon = new BABYLON.Mesh(this.name + "-icon", this.getScene());
        SmallIcon.smallIconMeshData.applyToMesh(icon);
        icon.position.copyFromFloats(0, 0, 0);
        icon.parent = this;
        let iconMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
        iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
        iconMaterial.diffuseTexture.hasAlpha = true;
        iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        icon.material = iconMaterial;
        this.frame = new BABYLON.Mesh(this.name + "-frame", this.getScene());
        SmallIcon.smallIconFrameMeshData.applyToMesh(this.frame);
        this.frame.position.copyFromFloats(0, 0, 0);
        this.frame.parent = this;
        this.frame.material = SmallIcon.smallIconFrameMaterial;
        for (let j = 0; j < this.getChildMeshes().length; j++) {
            this.getChildMeshes()[j].isVisible = false;
        }
        console.log("SmallIcon " + this.name + " initialized.");
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
        SmallIcon.instances.forEach((i) => {
            i.Unlit();
        });
    }
}
SmallIcon.instances = [];
SmallIcon.onSmallIconFrameDataLoaded = [];
SmallIcon.smallIconFrameDataLoading = false;
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
