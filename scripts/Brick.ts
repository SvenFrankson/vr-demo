class Brick extends BABYLON.Mesh {
  public static instances: Brick[] = [];
  public static grid: boolean[][][] = [];

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

  public static IsOccupied(c: BABYLON.Vector3): boolean {
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

  public static Occupy(c: BABYLON.Vector3): void {
    if (Brick.grid[c.x] === undefined) {
      Brick.grid[c.x] = [];
    }
    if (Brick.grid[c.x][c.y] === undefined) {
      Brick.grid[c.x][c.y] = [];
    }
    Brick.grid[c.x][c.y][c.z] = true;
  }

  public static Free(c: BABYLON.Vector3): void {
    if (Brick.grid[c.x] === undefined) {
      Brick.grid[c.x] = [];
    }
    if (Brick.grid[c.x][c.y] === undefined) {
      Brick.grid[c.x][c.y] = [];
    }
    Brick.grid[c.x][c.y][c.z] = false;
  }

  public static TryAdd(
    c: BABYLON.Vector3,
    width: number,
    height: number,
    length: number,
    orientation: number
  ): Brick {
    for (let i: number = 0; i < width; i++) {
      for (let j: number = 0; j < height; j++) {
        for (let k: number = 0; k < length; k++) {
          if (Brick.IsOccupied(c.add(VRMath.RotateVector3(new BABYLON.Vector3(i, j, k), orientation)))) {
            return undefined;
          }
        }
      }
    }
    let brick: Brick = new Brick(c, width, height, length, orientation);
    return brick;
  }

  private coordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private width: number;
  private height: number;
  private length: number;
  private orientation: number;

  constructor(
    c: BABYLON.Vector3,
    width: number,
    height: number,
    length: number,
    orientation: number,
  ) {
    super("Brick", Main.Scene);
      console.log("Add new Brick at " + c.x + " " + c.y + " " + c.z);
    this.coordinates.copyFrom(c);
    this.width = width;
    this.height = height;
    this.length = length;
    this.orientation = orientation;
    this.rotation.y = orientation * Math.PI / 2;
    BrickData.CubicalData(width, height, length).applyToMesh(this);
    this.position = Brick.BrickCoordinatesToWorldPos(c);
    for (let i: number = 0; i < width; i++) {
      for (let j: number = 0; j < height; j++) {
        for (let k: number = 0; k < length; k++) {
          Brick.Occupy(c.add(VRMath.RotateVector3(new BABYLON.Vector3(i, j, k), orientation)));
        }
      }
    }
    this.freezeWorldMatrix();
    Brick.instances.push(this);
  }

  public Dispose(): void {
    this.dispose();
    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        for (let k: number = 0; k < this.length; k++) {
          Brick.Free(this.coordinates.add(VRMath.RotateVector3(new BABYLON.Vector3(i, j, k), this.orientation)));
        }
      }
    }
  }

  public Hightlight(color: BABYLON.Color3): void {
    this.renderOutline = true;
    this.outlineColor.copyFrom(color);
    this.outlineWidth = 0.02;
  }

  public Unlit(): void {
    this.outlineColor.copyFromFloats(0, 0, 0);
  }

  public static UnlitAll(): void {
    Brick.instances.forEach(
      (b: Brick) => {
        b.Unlit();
      }
    );
  }
}
