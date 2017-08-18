class SaveManager {
  public static Save(): void {
    localStorage.setItem(Main.currentSave, JSON.stringify(Brick.Serialize()));
    localStorage.setItem(Main.currentSave + "-pic", Main.Canvas.toDataURL("image/png"));
  }

  public static Load(): void {
    let save: ISerializedBrick[] = JSON.parse(localStorage.getItem(Main.currentSave));
    if (save) {
      Brick.UnserializeArray(save);
    }
  }
}
