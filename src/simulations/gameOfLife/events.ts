export type HandlerObject = Record<string, () => void>;

function setWindowEvents(handlers: HandlerObject) {
  return (e: KeyboardEvent) => {
    for (const key in handlers) {
      if (e.key !== key) return;
      if (!handlers[key]) return;
      handlers[key]();
    }
  };
}

export function setEvents(handlers: HandlerObject) {
  window.addEventListener("keypress", setWindowEvents(handlers));
}

export function removeEvents(handlers: HandlerObject) {
  window.removeEventListener("keypress", setWindowEvents(handlers));
}
