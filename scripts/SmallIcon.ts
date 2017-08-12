class SmallIcon extends BABYLON.Mesh {

  public static instances: SmallIcon[] = [];
  private static smallIconMeshData: BABYLON.VertexData;
  private static smallIconFrameMeshData: BABYLON.VertexData;
  private static smallIconFrameMaterial: BABYLON.StandardMaterial;
  private static onSmallIconFrameDataLoaded: (() => void)[] = [];
  private static smallIconFrameDataLoading: boolean = false;

  private static LoadSmallIconFrameData(scene: BABYLON.Scene): void {
    if (SmallIcon.smallIconFrameDataLoading) {
      return;
    }
    SmallIcon.smallIconFrameDataLoading = true;
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./datas/small-icon-base.babylon",
      "",
      scene,
      (
        meshes: BABYLON.AbstractMesh[]
      ) => {
        console.log("smallIconMeshData loaded");
        for (let i: number = 0; i < meshes.length; i++) {
          if (meshes[i] instanceof BABYLON.Mesh) {
            let mesh: BABYLON.Mesh = meshes[i] as BABYLON.Mesh;
            if (mesh.name.indexOf("Icon") !== -1) {
              SmallIcon.smallIconMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
            } else if (mesh.name.indexOf("Frame") !== -1) {
              SmallIcon.smallIconFrameMeshData = BABYLON.VertexData.ExtractFromMesh(mesh);
            }
            mesh.dispose();
          }
        }
        SmallIcon.smallIconFrameMaterial = new BABYLON.StandardMaterial("IconFrameMaterial", scene);
        SmallIcon.smallIconFrameMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/frame-small-icon.png", scene);
        SmallIcon.smallIconFrameMaterial.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
        SmallIcon.smallIconFrameMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        for (let i: number = 0; i < SmallIcon.onSmallIconFrameDataLoaded.length; i++) {
          SmallIcon.onSmallIconFrameDataLoaded[i]();
        }
      }
    );
  }

  // private localPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private frame: BABYLON.Mesh;
  public onActivate: () => void;

  constructor(
    picture: string,
    position: BABYLON.Vector3,
    parent: Icon,
    scale: number = 1,
    onActivate: () => void = () => {return;}
  ) {
    super(picture, parent.getScene());
    this.position.copyFrom(position);
    this.parent = parent;
    this.rotation.copyFromFloats(0, 0, 0);
    this.scaling.copyFromFloats(scale, scale, scale);
    this.onActivate = onActivate;
    if (SmallIcon.smallIconMeshData && SmallIcon.smallIconFrameMeshData) {
      this.Initialize();
    } else {
      SmallIcon.LoadSmallIconFrameData(parent.getScene());
      SmallIcon.onSmallIconFrameDataLoaded.push(
        () => {
          this.Initialize();
        }
      );
    }
    SmallIcon.instances.push(this);
  }

  private Initialize(): void {
    console.log("Icon " + this.name + " initializing...");

    let icon: BABYLON.Mesh = new BABYLON.Mesh(this.name + "-icon", this.getScene());
    SmallIcon.smallIconMeshData.applyToMesh(icon);
    icon.position.copyFromFloats(0, 0, 0);
    icon.parent = this;
    let iconMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial(this.name + "-mat", this.getScene());
    iconMaterial.diffuseTexture = new BABYLON.Texture("./datas/textures/" + this.name + ".png", this.getScene());
    iconMaterial.diffuseTexture.hasAlpha = true;
    iconMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    icon.material = iconMaterial;

    this.frame = new BABYLON.Mesh(this.name + "-frame", this.getScene());
    SmallIcon.smallIconFrameMeshData.applyToMesh(this.frame);
    this.frame.position.copyFromFloats(0, 0, 0);
    this.frame.parent = this;
    this.frame.material = SmallIcon.smallIconFrameMaterial;

    for (let j: number = 0; j < this.getChildMeshes().length; j++) {
      this.getChildMeshes()[j].isVisible = false;
    }

    console.log("SmallIcon " + this.name + " initialized.");
  }

  public Hightlight(): void {
    if (this.frame) {
      this.frame.renderOutline = true;
      this.frame.outlineColor = BABYLON.Color3.White();
      this.frame.outlineWidth = 0.02;
    }
  }

  public Unlit(): void {
    if (this.frame) {
      this.frame.renderOutline = false;
    }
  }

  public static UnlitAll(): void {
    SmallIcon.instances.forEach(
      (i: SmallIcon) => {
        i.Unlit();
      }
    );
  }
}
