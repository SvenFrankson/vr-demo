class Control {
  private static DOUBLEPOINTERDELAY: number = 500;
  private static _lastPointerDownTime: number = 0;
  private static _cameraSpeed: number = 0;
  private static _mode: number = 0;
  public static get mode(): number {
    return Control._mode;
  }
  public static set mode(v: number) {
    Control._mode = v;
    if (Control.mode === 1) {
      Control.previewBrick.isVisible = true;
    } else {
      Control.previewBrick.isVisible = false;
    }
  }
  public static previewBrick: BABYLON.Mesh;
  private static _width: number = 1;
  public static get width(): number {
    return this._width;
  }
  public static set width(v: number) {
    this._width = v;
    BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
  }
  private static _height: number = 1;
  public static get height(): number {
    return this._height;
  }
  public static set height(v: number) {
    this._height = v;
    BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
  }
  private static _length: number = 1;
  public static get length(): number {
    return this._length;
  }
  public static set length(v: number) {
    this._length = v;
    BrickData.CubicalData(this.width, this.height, this.length).applyToMesh(Control.previewBrick);
  }

  public static onPointerDown(): void {
    let t: number = (new Date()).getTime();
    if ((t - Control._lastPointerDownTime) < Control.DOUBLEPOINTERDELAY) {
      Control._lastPointerDownTime = t;
      return this.onDoublePointerDown();
    }
    Control._lastPointerDownTime = t;

    let ray: BABYLON.Ray = Main.Camera.getForwardRay();
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      (mesh: BABYLON.Mesh) => {return mesh !== Main.cursor && mesh !== Control.previewBrick && mesh.isVisible;}
    );
    if (pick.hit) {
      Control._meshAimed = pick.pickedMesh;
      if (
        Control._meshAimed instanceof SmallIcon
      ) {
        Control._meshAimed.onActivate();
        return;
      } else if (
        Control._meshAimed.parent instanceof Icon
      ) {
        Control._meshAimed.parent.onActivate();
        return;
      }
    }
    if (Control.mode === 0) {
      Control._cameraSpeed = 0.05;
    }
    if (Control.mode === 1) {
      if (pick.hit) {
        let correctedPickPoint: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        correctedPickPoint.copyFrom(pick.pickedPoint.add(pick.getNormal().scale(0.1)));
        let coordinates: BABYLON.Vector3 = Brick.WorldPosToBrickCoordinates(correctedPickPoint);
        let newBrick: Brick = Brick.TryAdd(coordinates, this.width, this.height, this.length);
        if (newBrick) {
          let brickMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("BrickMaterial", Main.Scene);
          brickMaterial.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
          brickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
          newBrick.material = brickMaterial;
        }
      }
    }
    if (Control.mode === 2) {
      if (pick.hit) {
        if (pick.pickedMesh instanceof Brick) {
          pick.pickedMesh.dispose();
        }
      }
    }
  }

  public static onPointerUp(): void {
    Control._cameraSpeed = 0;
  }

  public static onDoublePointerDown(): void {
    if (Control.mode === 0) {
      Control._cameraSpeed = -0.05;
    }
  }

  private static _meshAimed: BABYLON.AbstractMesh;
  public static Update(): void {
    Control.previewBrick.isVisible = false;
    Icon.UnlitAll();
    SmallIcon.UnlitAll();
    Brick.UnlitAll();
    let ray: BABYLON.Ray = Main.Camera.getForwardRay();
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      (mesh: BABYLON.Mesh) => {return mesh !== Main.cursor && mesh !== Control.previewBrick && mesh.isVisible;}
    );
    if (pick.hit) {
      Control._meshAimed = pick.pickedMesh;
      if (
        Control._meshAimed instanceof SmallIcon
      ) {
        Control._meshAimed.Hightlight();
      } else if (
        Control._meshAimed.parent instanceof Icon
      ) {
        Control._meshAimed.parent.Hightlight();
      } else {
        if (Control._meshAimed instanceof Brick) {
          if (Control.mode === 1) {
            Control._meshAimed.Hightlight(BABYLON.Color3.White());
          }
          if (Control.mode === 2) {
            Control._meshAimed.Hightlight(BABYLON.Color3.Red());
          }
        }
        if (Control.mode === 1) {
          let correctedPickPoint: BABYLON.Vector3 = BABYLON.Vector3.Zero();
          correctedPickPoint.copyFrom(pick.pickedPoint.add(pick.getNormal().scale(0.1)));
          Control.previewBrick.isVisible = true;
          Control.previewBrick.position = Brick.BrickCoordinatesToWorldPos(Brick.WorldPosToBrickCoordinates(correctedPickPoint));
        }
      }
    }
    if (Control.mode === 0) {
      Control.UpdateModeMove();
    }
  }

  private static UpdateModeMove(): void {
    if (Control._cameraSpeed !== 0) {
      let move: BABYLON.Vector3 = Main.Camera.getForwardRay().direction;
      move.scaleInPlace(Control._cameraSpeed);
      Main.Camera.position.addInPlace(move);
      Main.Camera.position.y = Math.max(Main.Camera.position.y, 2);
    }
  }

  public static CreatePreviewBrick(): void {
    Control.previewBrick = new BABYLON.Mesh("PreviewBrick", Main.Scene);
    Control.previewBrick.isPickable = false;
    BrickData.CubicalData(1, 3, 1).applyToMesh(Control.previewBrick);
    let previewBrickMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("PreviewBrickMaterial", Main.Scene);
    previewBrickMaterial.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
    previewBrickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    previewBrickMaterial.alpha = 0.5;
    Control.previewBrick.material = previewBrickMaterial;
  }
}
