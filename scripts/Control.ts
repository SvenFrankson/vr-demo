class Control {
  private static DOUBLEPOINTERDELAY: number = 500;
  private static _lastPointerDownTime: number = 0;
  private static HEADTILTDELAY: number = 1000;
  private static _lastHeadTiltedTime: number = 0;
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
  private static _color: string = "efefef";
  public static get color(): string {
    return this._color;
  }
  public static set color(v: string) {
    this._color = v;
    if (Control.previewBrick.material instanceof BABYLON.StandardMaterial) {
      Control.previewBrick.material.diffuseColor = BABYLON.Color3.FromHexString("#" + this.color);
    }
  }
  private static _rotation: number = 0;
  public static get rotation(): number {
    return this._rotation;
  }
  public static set rotation(v: number) {
    this._rotation = v % 4;
    Control.previewBrick.rotation.y = v * Math.PI / 2;
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
          brickMaterial.diffuseColor = BABYLON.Color3.FromHexString("#" + Control.color);
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
    if (Control.mode === 4) {
      if (pick.hit) {
        if (pick.pickedMesh instanceof Brick) {
          if (pick.pickedMesh.material instanceof BABYLON.StandardMaterial) {
            pick.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#" + Control.color);
          }
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
          if (Control.mode === 4) {
            Control._meshAimed.Hightlight(BABYLON.Color3.FromHexString("#" + Control.color));
          }
        }
        if (Control.mode === 1) {
          // Control.CheckHeadTilt();
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

  private static _cameraRight: BABYLON.Vector3 = BABYLON.Vector3.Zero();

  private static CheckHeadTilt(): void {
    BABYLON.Vector3.TransformNormalToRef(BABYLON.Axis.X, Main.Camera.getWorldMatrix(), Control._cameraRight);
    let angle: number = VRMath.Angle(BABYLON.Axis.Y, BABYLON.Vector3.Cross(Main.Camera.upVector, Main.Camera.getForwardRay().direction));
    console.log(angle - Math.PI / 2);
    if (angle - Math.PI / 2 > Math.PI / 6) {
      Control.HeadTilted();
    } else {
      Control._lastHeadTiltedTime = (new Date()).getTime();
    }
  }

  private static HeadTilted(): void {
    let t: number = (new Date()).getTime();
    if ((t - Control._lastHeadTiltedTime) > Control.HEADTILTDELAY) {
      Control.rotation += 1;
      Control._lastHeadTiltedTime = (new Date()).getTime();
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
    previewBrickMaterial.diffuseColor = BABYLON.Color3.FromHexString("#" + Control.color);
    previewBrickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    previewBrickMaterial.alpha = 0.5;
    Control.previewBrick.material = previewBrickMaterial;
  }
}
