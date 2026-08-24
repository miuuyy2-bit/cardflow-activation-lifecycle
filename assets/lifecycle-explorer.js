export function mountLifecycleExplorer(explorer, states) {
  if (!explorer || !states) return false;

  const tabs = Array.from(explorer.querySelectorAll("[role='tab']"));
  const panel = explorer.querySelector("[role='tabpanel']");
  if (!tabs.length || !panel) return false;

  const fields = {
    code: panel.querySelector("[data-state-code]"),
    title: panel.querySelector("[data-state-title]"),
    summary: panel.querySelector("[data-state-summary]"),
    proves: panel.querySelector("[data-state-proves]"),
    limits: panel.querySelector("[data-state-limits]"),
    owner: panel.querySelector("[data-state-owner]"),
    evidence: panel.querySelector("[data-state-evidence]")
  };

  function selectState(tab, moveFocus = false) {
    const state = states[tab.dataset.state];
    if (!state) return;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    Object.entries(fields).forEach(([key, element]) => {
      if (element) element.textContent = state[key];
    });

    panel.setAttribute("aria-labelledby", tab.id);
    panel.dataset.activeState = tab.dataset.state;
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectState(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex !== index) {
        event.preventDefault();
        selectState(tabs[nextIndex], true);
      }
    });
  });

  return true;
}
