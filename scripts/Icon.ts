class Icon extends BABYLON.Mesh {

  private static iconMeshData: BABYLON.VertexData;
  private static iconFrameMeshData: BABYLON.VertexData;
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
            if (mesh.name.indexOf("Icon")) {
              Icon.iconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
            } else if (mesh.name.indexOf("Frame")) {
              Icon.iconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
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
    this.rotation.copyFromFloats(0, Math.PI, 0);
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

    let frame: BABYLON.Mesh = new BABYLON.Mesh(this.name + "-frame", this.getScene());
    Icon.iconFrameMeshData.applyToMesh(frame);
    frame.position.copyFromFloats(0, 0, 0);
    frame.parent = this;

    console.log("Icon " + this.name + " initialized.");
  }

  private _targetPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private UpdatePosition(): void {
    this._targetPosition.copyFrom(this.camera.position);
    this._targetPosition.addInPlace(this.localPosition);
    BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.1, this.position);
  }
}
