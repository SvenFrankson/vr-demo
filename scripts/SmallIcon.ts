class SmallIcon extends BABYLON.Mesh {

  public static instances: SmallIcon[] = [];
  private static smallIconMeshData: BABYLON.VertexData;
  private static get SmallIconMeshData(): BABYLON.VertexData {
    if (!SmallIcon.smallIconMeshData) {
      let quad: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane(
        "Quad",
        {width: 0.5, height: 0.25},
        Main.Scene);
      SmallIcon.smallIconMeshData = BABYLON.VertexData.ExtractFromMesh(quad);
      quad.dispose();
    }
    return SmallIcon.smallIconMeshData;
  }

  private localPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private parentIcon: Icon;
  public iconClass: string[] = [];
  public onActivate: () => void;

  constructor(
    picture: string,
    position: BABYLON.Vector3,
    parent: Icon,
    scale: number = 1,
    iconClass: string[] = [],
    onActivate: () => void = () => {return;}
  ) {
    super(picture, parent.getScene());
    this.localPosition.copyFrom(position);
    this.localPosition.scaleInPlace(scale);
    this.parentIcon = parent;
    this.scaling.copyFromFloats(scale, scale, scale);
    this.onActivate = onActivate;
    this.iconClass = iconClass;
    this.Initialize();
    SmallIcon.instances.push(this);
    parent.getScene().registerBeforeRender(
      () => {
        this.UpdatePosition();
      }
    );
  }

  private Initialize(): void {
    console.log("Icon " + this.name + " initializing...");

    SmallIcon.SmallIconMeshData.applyToMesh(this);
    let iconMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
    iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
    iconMaterial.diffuseTexture.hasAlpha = true;
    iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    this.material = iconMaterial;
    this.enableEdgesRendering();
    this.Unlit();
    this.isVisible = false;

    console.log("SmallIcon " + this.name + " initialized.");
  }

  public Hightlight(): void {
    this.lookAt(Main.Camera.position, 0, Math.PI, 0, BABYLON.Space.LOCAL);
    this.edgesColor.copyFromFloats(0, 0, 0, 1);
    this.edgesWidth = 1;
    if (this.material instanceof BABYLON.StandardMaterial) {
      this.material.useAlphaFromDiffuseTexture = false;
    }
  }

  public Unlit(): void {
    this.edgesColor.copyFromFloats(0, 0, 0, 0.75);
    this.edgesWidth = 1;
    if (this.material instanceof BABYLON.StandardMaterial) {
      this.material.useAlphaFromDiffuseTexture = true;
    }
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
          smallIcon.isVisible = true;
        }
      }
    }
  }

  public static HideClass(iconClass: string): void {
    for (let i: number = 0; i < SmallIcon.instances.length; i++) {
      let smallIcon: SmallIcon = SmallIcon.instances[i];
      for (let j: number = 0; j < smallIcon.iconClass.length; j++) {
        if (smallIcon.iconClass[j].indexOf(iconClass) !== -1) {
          smallIcon.isVisible = false;
        }
      }
    }
  }

  private _targetPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private UpdatePosition(): void {
    BABYLON.Vector3.TransformCoordinatesToRef(
      this.localPosition,
      this.parentIcon.getWorldMatrix(),
      this._targetPosition
    );
    if (isNaN(this._targetPosition.x)) {
      return;
    }
    BABYLON.Vector3.LerpToRef(this.position, this._targetPosition, 0.05, this.position);
    this.lookAt(Main.Camera.position, 0, 0, 0);
  }
}
