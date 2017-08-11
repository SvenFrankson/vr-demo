class Icon extends BABYLON.Mesh {

  private static iconMeshData: BABYLON.VertexData;
  private static iconFrameMeshData: BABYLON.VertexData;
  private static iconFrameMaterial: BABYLON.MultiMaterial;
  private static onIconFrameDataLoaded: (() => void)[] = [];
  private static iconFrameDataLoading: boolean = false;

  private static LoadIconFrameData(scene: BABYLON.Scene): void {
    if (Icon.iconFrameDataLoading) {
      return;
    }
    Icon.iconFrameDataLoading = true;
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./datas/icon-base.babylon",
      "",
      scene,
      (
        meshes: BABYLON.AbstractMesh[]
      ) => {
        console.log("IconMeshData loaded");
        for (let i: number = 0; i < meshes.length; i++) {
          if (meshes[i] instanceof BABYLON.Mesh) {
            let mesh: BABYLON.Mesh = meshes[i] as BABYLON.Mesh;
            if (mesh.name.indexOf("Icon") !== -1) {
              Icon.iconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
            } else if (mesh.name.indexOf("Frame") !== -1) {
              Icon.iconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
              if (mesh.material instanceof BABYLON.MultiMaterial) {
                Icon.iconFrameMaterial = mesh.material;
              }
            }
            mesh.dispose();
          }
        }
        for (let i: number = 0; i < Icon.onIconFrameDataLoaded.length; i++) {
          Icon.onIconFrameDataLoaded[i]();
        }
      }
    );
  }

  private localPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private camera: BABYLON.FreeCamera;

  constructor(
    picture: string,
    position: BABYLON.Vector3,
    camera: BABYLON.FreeCamera,
    scale: number = 1
  ) {
    super(picture, camera.getScene());
    this.localPosition.copyFrom(position);
    this.camera = camera;
    this.rotation.copyFromFloats(0, 0, 0);
    if (Icon.iconMeshData && Icon.iconFrameMeshData) {
      this.Initialize();
    } else {
      Icon.LoadIconFrameData(camera.getScene());
      Icon.onIconFrameDataLoaded.push(
        () => {
          this.Initialize();
        }
      );
    }
    camera.getScene().registerBeforeRender(
      () => {
        this.UpdatePosition();
      }
    );
  }

  private Initialize(): void {
    console.log("Icon " + this.name + " initializing...");

    let icon: BABYLON.Mesh = new BABYLON.Mesh(this.name + "-icon", this.getScene());
    Icon.iconMeshData.applyToMesh(icon);
    icon.position.copyFromFloats(0, 0, 0);
    icon.parent = this;
    let iconMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
    iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
    iconMaterial.diffuseTexture.hasAlpha = true;
    iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    icon.material = iconMaterial;

    let frame: BABYLON.Mesh = new BABYLON.Mesh(this.name + "-frame", this.getScene());
    Icon.iconFrameMeshData.applyToMesh(frame);
    frame.position.copyFromFloats(0, 0, 0);
    frame.parent = this;
    let frameMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial(this.name + "-frame-mat", this.getScene());
    frameMaterial.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
    frameMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    frame.material = frameMaterial;

    console.log("Icon " + this.name + " initialized.");
  }

  private _cameraForward: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private _targetPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private _worldishMatrix: BABYLON.Matrix = BABYLON.Matrix.Identity();
  private _alphaCam: number = 0;
  private UpdatePosition(): void {
    this._cameraForward = this.camera.getForwardRay().direction;
    if (this._cameraForward.y > 0) {
      this._alphaCam = VRMath.AngleFromToAround(BABYLON.Axis.Z, this._cameraForward, BABYLON.Axis.Y);
    }
    let rotationQuaternion: BABYLON.Quaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, this._alphaCam);
    BABYLON.Matrix.ComposeToRef(
      BABYLON.Vector3.One(),
      rotationQuaternion,
      this.camera.position,
      this._worldishMatrix
    );
    BABYLON.Vector3.TransformCoordinatesToRef(
      this.localPosition,
      this._worldishMatrix,
      this._targetPosition
    );
    if (isNaN(this._targetPosition.x)) {
      console.log("Break");
      return;
    }
    BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.05, this.position);
    this.lookAt(this.camera.position, 0, Math.PI, Math.PI);
  }
}
