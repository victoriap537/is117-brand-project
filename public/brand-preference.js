"use strict";

(() => {
  const preferenceGroup = document.querySelector("#style-preference");
  const result = document.querySelector("#preference-result");

  if (!preferenceGroup || !result) {
    throw new Error("Style preference controls are missing.");
  }

  const panels = Array.from(result.querySelectorAll("[data-preference-panel]"));

  if (panels.length !== 2) {
    throw new Error("Both style preference responses must be defined.");
  }

  preferenceGroup.addEventListener("change", (event) => {
    const selected = event.target;
    if (
      !(selected instanceof HTMLInputElement) ||
      selected.name !== "style-preference" ||
      !selected.checked
    ) {
      return;
    }

    const panel = panels.find(
      (candidate) => candidate.dataset.preferencePanel === selected.value,
    );
    if (!panel) {
      throw new Error(
        `No style preference response exists for ${selected.value}.`,
      );
    }

    panels.forEach((candidate) => {
      candidate.hidden = candidate !== panel;
    });
    result.hidden = false;
  });
})();
