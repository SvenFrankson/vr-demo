class PrettyBrick extends BABYLON.Mesh {
  constructor(
    width: number,
    height: number,
    length: number,
    scene: BABYLON.Scene
  ) {
    super("PrettyBrick", scene);
    let box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
      "Box",
      {
        width: width * Config.XSize,
        height: height * Config.YSize,
        depth: length * Config.ZSize
      },
      scene
    );
    box.renderOutline = true;
    box.outlineColor.copyFromFloats(0, 0, 0);
    box.outlineWidth = 0.05;
    box.parent = this;
    for (let i: number = 0; i < width; i++) {
      for (let j: number = 0; j < length; j++) {
        let plot: BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder(
          "Plot",
          {
            height: Config.YSize / 2,
            diameter: Config.XSize / 2
          },
          scene
        );
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
