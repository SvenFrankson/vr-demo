/// <reference path="../lib/babylon.gui.d.ts"/>

class TextManager {
  public static DisplayText(text: string, duration: number): void {
    let plane: BABYLON.Mesh = BABYLON.Mesh.CreatePlane("Plane", 2, Main.Scene);
    plane.position.z = 2;
    BABYLON.Vector3.TransformCoordinatesToRef(plane.position, GUI.cameraGUIMatrix, plane.position);
    plane.lookAt(Main.Camera.position);
    let texture: BABYLON.GUI.AdvancedDynamicTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    let block: BABYLON.GUI.TextBlock = new BABYLON.GUI.TextBlock();
    block.text = text;
    block.color = "white";
    block.fontFamily = "Helvetica";
    block.fontSize = 100;
    texture.addControl(block);
  }
}
