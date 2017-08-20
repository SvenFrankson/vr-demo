function UnselectAllSaves(): void {
  $(".save").removeClass("panel-primary");
  $(".save").addClass("panel-default");
}

window.addEventListener("DOMContentLoaded",
  () => {
    for (let i: number = 1; i <= 5; i++) {
      let data: string = localStorage.getItem("save" + i + "-pic");
      if (data && data.indexOf("data") !== -1) {
        $("#save" + i + "-pic").attr("src", data);
      }
    }
    $(".save").on("pointerdown", (e: PointerEvent) => {
      if (e.currentTarget instanceof HTMLElement) {
        let id: string = e.currentTarget.id;
        Main.currentSave = id;
        UnselectAllSaves();
        $("#" + id).removeClass("panel-default");
        $("#" + id).addClass("panel-primary");
      }
    });
  }
);
