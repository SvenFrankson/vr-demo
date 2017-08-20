/// <reference path="../lib/babylon.gui.d.ts"/>

class Text3D {
  private mesh: BABYLON.Mesh;
  private texture: BABYLON.GUI.AdvancedDynamicTexture;
  private block: BABYLON.GUI.TextBlock;
  private tStart: number;
  private fadeInDelay: number;
  private delay: number;
  private fadeOutDelay: number;

  constructor(
    position: BABYLON.Vector3,
    text: string,
    fadeInDelay: number = 500,
    delay: number = 3000,
    fadeOutDelay: number = 1000
  ) {
    this.mesh = BABYLON.Mesh.CreatePlane("Text3D", 4, Main.Scene);
    this.mesh.position.copyFrom(position);
    BABYLON.Vector3.TransformCoordinatesToRef(this.mesh.position, GUI.cameraGUIMatrix, this.mesh.position);
    this.mesh.lookAt(Main.Camera.position);
    this.texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.mesh);
    this.block = new BABYLON.GUI.TextBlock();
    this.block.text = text;
    this.block.color = "white";
    this.block.fontFamily = "Helvetica";
    this.block.fontSize = 50;
    this.texture.addControl(this.block);
    this.tStart = (new Date()).getTime();
    this.fadeInDelay = fadeInDelay;
    this.delay = delay;
    this.fadeOutDelay = fadeOutDelay;
    let up: () => void = () => {
      this.update(
        () => {
          Main.Scene.unregisterBeforeRender(up);
        }
      );
    };
    Main.Scene.registerBeforeRender(up);
  }

  private update(onDone: () => void): void {
    let t: number = (new Date()).getTime() - this.tStart;
    if (t < this.fadeInDelay) {
      this.block.alpha = t / this.fadeInDelay;
    } else if (t < this.fadeInDelay + this.delay) {
      this.block.alpha = 1;
    } else if (t < this.fadeInDelay + this.delay + this.fadeOutDelay) {
      this.block.alpha = 1 - ((t - this.fadeInDelay - this.delay) / this.fadeOutDelay);
    } else {
      this.texture.dispose();
      this.mesh.dispose();
      onDone();
    }
  }
}
