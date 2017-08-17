class SmallIcon extends BABYLON.Mesh {

  public static lockCameraRotation: boolean = false;
  public static LockCameraRotation(): void {
    SmallIcon.lockCameraRotation = true;
  }
  public static UnLockCameraRotation(): void {
    SmallIcon.lockCameraRotation = false;
  }
  public static instances: SmallIcon[] = [];
  /*
  private static SmallIconMeshData(width: number, height: number): BABYLON.VertexData {
    let quad: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane(
      "Quad",
      {width: width, height: height},
      Main.Scene);
    let data: BABYLON.VertexData = BABYLON.VertexData.ExtractFromMesh(quad);
    quad.dispose();
    return data;
  }
  */

  private localPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private localRotation: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private camera: BABYLON.FreeCamera;
  public iconClass: string[] = [];
  public onActivate: () => void;

  constructor(
    picture: string,
    icon: string,
    camera: BABYLON.FreeCamera,
    iconClass: string[] = [],
    onActivate: () => void = () => {return;}
  ) {
    super(picture, camera.getScene());
    this.localPosition.copyFrom(IconLoader.datas.get(icon).position);
    this.localPosition.copyFrom(IconLoader.datas.get(icon).rotation);
    this.camera = camera;
    this.rotationQuaternion = BABYLON.Quaternion.Identity();
    this.onActivate = onActivate;
    this.iconClass = iconClass;
    IconLoader.datas.get(icon).vertexData.applyToMesh(this);
    let iconMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
    iconMaterial.emissiveColor.copyFromFloats(1, 1, 1);
    iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
    iconMaterial.diffuseTexture.hasAlpha = true;
    iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    this.material = iconMaterial;
    this.enableEdgesRendering();
    this.Unlit();
    SmallIcon.instances.push(this);
    camera.getScene().registerBeforeRender(
      () => {
        this.UpdatePosition();
      }
    );
  }

  public Hightlight(): void {
    this.edgesColor.copyFromFloats(0, 0, 0, 1);
    this.edgesWidth = 0.5;
    if (this.material instanceof BABYLON.StandardMaterial) {
      this.material.useAlphaFromDiffuseTexture = false;
    }
  }

  public Unlit(): void {
    this.edgesColor.copyFromFloats(0, 0, 0, 0.75);
    this.edgesWidth = 0.5;
    if (this.material instanceof BABYLON.StandardMaterial) {
      this.material.useAlphaFromDiffuseTexture = true;
    }
  }

  public Show(): void {
    this.isVisible = true;
  }

  public Hide(): void {
    this.isVisible = false;
  }

  public static UnlitAll(): void {
    SmallIcon.instances.forEach(
      (i: SmallIcon) => {
        i.Unlit();
      }
    );
  }

  public static ShowClass(iconClass: string): void {
    for (let i: number = 0; i < SmallIcon.instances.length; i++) {
      let smallIcon: SmallIcon = SmallIcon.instances[i];
      for (let j: number = 0; j < smallIcon.iconClass.length; j++) {
        if (smallIcon.iconClass[j].indexOf(iconClass) !== -1) {
          smallIcon.Show();
        }
      }
    }
  }

  public static HideClass(iconClass: string): void {
    for (let i: number = 0; i < SmallIcon.instances.length; i++) {
      let smallIcon: SmallIcon = SmallIcon.instances[i];
      for (let j: number = 0; j < smallIcon.iconClass.length; j++) {
        if (smallIcon.iconClass[j].indexOf(iconClass) !== -1) {
          smallIcon.Hide();
        }
      }
    }
  }

  private _cameraUp: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private _cameraForward: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private _targetPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private _worldishMatrix: BABYLON.Matrix = BABYLON.Matrix.Identity();
  private _alphaCam: number = 0;
  private UpdatePosition(): void {
    BABYLON.Vector3.TransformNormalToRef(BABYLON.Axis.Z, this.camera.getWorldMatrix(), this._cameraForward);
    BABYLON.Vector3.TransformNormalToRef(BABYLON.Axis.Y, this.camera.getWorldMatrix(), this._cameraUp);
    if (!SmallIcon.lockCameraRotation && this._cameraForward.y > -0.3) {
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
      return;
    }
    BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.05, this.position);
    this.rotationQuaternion = BABYLON.Quaternion.Slerp(this.rotationQuaternion, rotationQuaternion, 0.05);
  }
}
