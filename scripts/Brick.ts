class Brick extends BABYLON.Mesh {
  public static instances: Brick[] = [];

  public static WorldPosToBrickCoordinates(
    worldPosition: BABYLON.Vector3
  ): BABYLON.Vector3 {
    let coordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    coordinates.x = Math.round(worldPosition.x / Config.XSize);
    coordinates.y = Math.round(worldPosition.y / Config.YSize);
    coordinates.z = Math.round(worldPosition.z / Config.ZSize);
    return coordinates;
  }

  public static BrickCoordinatesToWorldPos(
    coordinates: BABYLON.Vector3
  ): BABYLON.Vector3 {
    let worldPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    worldPosition.x = coordinates.x * Config.XSize;
    worldPosition.y = coordinates.y * Config.YSize;
    worldPosition.z = coordinates.z * Config.ZSize;
    return worldPosition;
  }

  constructor(
    coordinates: BABYLON.Vector3
  ) {
    console.log("Add new Brick at " + coordinates.x + " " + coordinates.y + " " + coordinates.z);
    super("Brick", Main.Scene);
    BrickData.CubicalData(1, 3, 1).applyToMesh(this);
    this.position = Brick.BrickCoordinatesToWorldPos(coordinates);
    Brick.instances.push(this);
  }

  public Hightlight(color: BABYLON.Color3): void {
    this.renderOutline = true;
    this.outlineColor.copyFrom(color);
    this.outlineWidth = 0.02;
  }

  public Unlit(): void {
    this.renderOutline = false;
  }

  public static UnlitAll(): void {
    Brick.instances.forEach(
      (i: Icon) => {
        i.Unlit();
      }
    );
  }
}
