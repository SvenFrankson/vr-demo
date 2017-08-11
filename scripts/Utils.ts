class Utils {

  public static RequestFullscreen(): void {
    if (Main.Canvas.requestFullscreen) {
      Main.Canvas.requestFullscreen();
    } else if (Main.Canvas.webkitRequestFullscreen) {
      Main.Canvas.webkitRequestFullscreen();
    }
    /*if (screen.orientation["lock"]) {
      screen.orientation["lock"]("landscape");
    }*/
    Main.Engine.resize();
  }
}
