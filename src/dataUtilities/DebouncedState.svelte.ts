type DebouncedStateOptions = {
  debounce: number;
};

export default class DebouncedState {
  #state: any = $state();
  #debouncedValue: any = $state();
  #timeoutId: ReturnType<typeof setTimeout> | null = null;
  #typeOfInitialValue: string = "";
  options: DebouncedStateOptions = {
    debounce: 0,
  };

  constructor(val: any, options: DebouncedStateOptions) {
    this.#state = val;
    this.#debouncedValue = val;
    this.options = options;
    this.#typeOfInitialValue = typeof val;
  }

  get value() {
    return this.#state;
  }

  get debounced() {
    return this.#debouncedValue;
  }

  set value(val: any) {
    let formatttedVal = val;

    if (this.#typeOfInitialValue === "number") {
      formatttedVal = Number(formatttedVal);
    }

    if (this.#typeOfInitialValue === "boolean") {
      if (val === "true") {
        formatttedVal = true;
      } else if (val === "false") {
        formatttedVal = false;
      } else {
        throw new Error(`Initial Value was Boolean, type of new value is ${typeof val}`);
      }
    }

    this.#state = formatttedVal;

    if (this.#timeoutId) clearTimeout(this.#timeoutId);

    this.#timeoutId = setTimeout(() => {
      this.#debouncedValue = this.#state;
    }, this.options.debounce);
    
  }
}
