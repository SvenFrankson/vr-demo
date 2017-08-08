var Main = (function () {
    function Main(canvasElement) {
        Main.Canvas = document.getElementById(canvasElement);
        Main.Engine = new BABYLON.Engine(Main.Canvas, true);
    }
    Main.prototype.createScene = function () {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        Main.Camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), Main.Scene);
        Main.Camera.setPosition(new BABYLON.Vector3(5, 2, 5));
        Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
        Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
        Main.Light.specular = new BABYLON.Color3(1, 1, 1);
    };
    Main.prototype.animate = function () {
        Main.Engine.runRenderLoop(function () {
            Main.Scene.render();
        });
        window.addEventListener("resize", function () {
            Main.Engine.resize();
        });
    };
    return Main;
}());
window.addEventListener("DOMContentLoaded", function () {
    var game = new Main("render-canvas");
    game.createScene();
    game.animate();
});
