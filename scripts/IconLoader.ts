class IconData {
  constructor(
    public vertexData: BABYLON.VertexData,
    public position: BABYLON.Vector3
  ) {}
}

class IconLoader {
  public static datas: Map<string, IconData> = new Map<string, IconData>();

  public static LoadIcons(callback: () => void): void {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./datas/icon-base.babylon",
      "",
      Main.Scene,
      (
        meshes: BABYLON.AbstractMesh[]
      ) => {
        for (let i: number = 0; i < meshes.length; i++) {
          let m: BABYLON.AbstractMesh = meshes[i];
          if (m instanceof BABYLON.Mesh) {
            IconLoader.datas.set(
              m.name,
              new IconData(
                BABYLON.VertexData.ExtractFromMesh(m),
                m.position.clone()
              )
            );
          }
        }
        callback();
      }
    );
  }
}
