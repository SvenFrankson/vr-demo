class BrickMaterial {
  private static materials: Map<string, BABYLON.StandardMaterial> = new Map<string, BABYLON.StandardMaterial>();

  public static GetMaterial(color: string): BABYLON.StandardMaterial {
    let material: BABYLON.StandardMaterial = BrickMaterial.materials.get(color);
    if (!material) {
      material = new BABYLON.StandardMaterial("BrickMaterial-" + color, Main.Scene);
      material.diffuseColor = BABYLON.Color3.FromHexString(color);
      material.specularColor.copyFromFloats(0.2, 0.2, 0.2);
      BrickMaterial.materials.set(color, material);
    }
    return material;
  }
}
