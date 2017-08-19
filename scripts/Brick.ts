interface ISerializedBrick {
  i: number;
  j: number;
  k: number;
  orientation: number;
  width: number;
  height: number;
  length: number;
  color: string;
}

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
    orientation: number,
    color: string
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
    let brick: Brick = new Brick(c, width, height, length, orientation, color);
    return brick;
  }

  public static Serialize(): ISerializedBrick[] {
    let serialized: ISerializedBrick[] = [];
    Brick.instances.forEach(
      (b: Brick) => {
        serialized.push(b.Serialize());
      }
    );
    return serialized;
  }

  public static UnserializeArray(serialized: ISerializedBrick[], save: boolean = false): void {
    serialized.forEach(
      (data: ISerializedBrick) => {
        Brick.Unserialize(data, save);
      }
    );
  }

  private coordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private width: number;
  private height: number;
  private length: number;
  private orientation: number;
  public get color(): string {
    if (this.material instanceof BABYLON.StandardMaterial) {
      return this.material.diffuseColor.toHexString();
    }
  }
  public set color(c: string) {
    this.material = BrickMaterial.GetMaterial(c);
    SaveManager.Save();
  }

  constructor(
    c: BABYLON.Vector3,
    width: number,
    height: number,
    length: number,
    orientation: number,
    color: string,
    save: boolean = true
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
    this.material = BrickMaterial.GetMaterial(color);
    this.freezeWorldMatrix();
    Brick.instances.push(this);
    if (save) {
      SaveManager.Save();
    }
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
    let index: number = Brick.instances.indexOf(this);
    if (index !== -1) {
      Brick.instances.splice(index, 1);
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

  public Serialize(): ISerializedBrick {
    return {
      i: this.coordinates.x,
      j: this.coordinates.y,
      k: this.coordinates.z,
      orientation: this.orientation,
      width: this.width,
      height: this.height,
      length: this.length,
      color: this.color
    };
  }

  public static Unserialize(data: ISerializedBrick, save: boolean = true): Brick {
    let coordinates: BABYLON.Vector3 = new BABYLON.Vector3(
      data.i,
      data.j,
      data.k
    );
    return new Brick(coordinates, data.width, data.height, data.length, data.orientation, data.color, save);
  }
}
