class Control {
  private static DOUBLEPOINTERDELAY: number = 500;
  private static _lastPointerDownTime: number = 0;
  private static HEADTILTDELAY: number = 1000;
  private static _lastHeadTiltedTime: number = 0;
  private static _cameraSpeed: number = 0;
  private static _mode: number = 0;
  private static _firstMove: boolean = true;
  private static _firstBuild: boolean = true;
  private static _firstPaint: boolean = true;
  private static _firstDelete: boolean = true;
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
    if (Control.mode === 0) {
      new Text3D(new BABYLON.Vector3(0, 0.3, 2), "Move Mode", 200, 1000, 1000);
      if (Control._firstMove) {
        Control._firstMove = false;
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Clic to go Forward.", 200, 5000, 1000);
        new Text3D(new BABYLON.Vector3(0, -0.3, 2), "Double clic to go backward.", 200, 7000, 1000);
      }
    } else if (Control.mode === 1) {
      new Text3D(new BABYLON.Vector3(0, 0.3, 2), "Build Mode", 200, 1000, 1000);
      if (Control._firstBuild) {
        Control._firstBuild = false;
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Clic to add block.", 200, 5000, 1000);
        new Text3D(new BABYLON.Vector3(0, -0.3, 2), "Tilt your head to rotate.", 200, 7000, 1000);
      }
    } else if (Control.mode === 4) {
      new Text3D(new BABYLON.Vector3(0, 0.3, 2), "Paint Mode", 200, 1000, 1000);
      if (Control._firstPaint) {
        Control._firstPaint = false;
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Clic to paint aimed block.", 200, 5000, 1000);
      }
    } else if (Control.mode === 2) {
      new Text3D(new BABYLON.Vector3(0, 0.3, 2), "Delete Mode", 200, 1000, 1000);
      if (Control._firstDelete) {
        Control._firstDelete = false;
        new Text3D(new BABYLON.Vector3(0, 0, 2), "Clic to delete aimed block.", 200, 5000, 1000);
      }
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
  private static _color: string = "#efefef";
  public static get color(): string {
    return this._color;
  }
  public static set color(v: string) {
    this._color = v;
    if (Control.previewBrick.material instanceof BABYLON.StandardMaterial) {
      Control.previewBrick.material.diffuseColor = BABYLON.Color3.FromHexString(this.color);
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

  public static pickPredicate(mesh: BABYLON.Mesh): boolean {
    return (
      mesh !== Main.cursor &&
      mesh !== Control.previewBrick &&
      mesh.isVisible &&
      !mesh.name.includes("Text3D")
    );
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
      Control.pickPredicate
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
        Brick.TryAdd(coordinates, this.width, this.height, this.length, this.rotation, Control.color);
      }
    }
    if (Control.mode === 2) {
      if (pick.hit) {
        if (pick.pickedMesh instanceof Brick) {
          pick.pickedMesh.Dispose();
        }
      }
    }
    if (Control.mode === 4) {
      if (pick.hit) {
        if (pick.pickedMesh instanceof Brick) {
          pick.pickedMesh.color = Control.color;
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
    Control.CheckHeadTilt();
    Control.previewBrick.isVisible = false;
    Icon.UnlitAll();
    SmallIcon.UnlitAll();
    Brick.UnlitAll();
    let ray: BABYLON.Ray = Main.Camera.getForwardRay();
    let pick: BABYLON.PickingInfo = Main.Scene.pickWithRay(
      ray,
      Control.pickPredicate
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
            Control._meshAimed.Hightlight(BABYLON.Color3.FromHexString(Control.color));
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

  private static CheckHeadTilt(): void {
    if (Main.Camera.deviceRotationQuaternion instanceof BABYLON.Quaternion) {
      let angle: number = Main.Camera.deviceRotationQuaternion.toEulerAngles().z;
      if (Math.abs(angle) > Math.PI / 6) {
        Control.HeadTilted(-BABYLON.MathTools.Sign(angle));
      } else {
        Control._lastHeadTiltedTime = (new Date()).getTime();
      }
    }
  }

  private static HeadTilted(sign: number): void {
    let t: number = (new Date()).getTime();
    if ((t - Control._lastHeadTiltedTime) > Control.HEADTILTDELAY) {
      Control.rotation += sign;
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
    previewBrickMaterial.diffuseColor = BABYLON.Color3.FromHexString(Control.color);
    previewBrickMaterial.specularColor.copyFromFloats(0.2, 0.2, 0.2);
    previewBrickMaterial.alpha = 0.5;
    Control.previewBrick.material = previewBrickMaterial;
    Control.previewBrick.rotation.y = Control.rotation * Math.PI / 2;
  }
}
