import { clamp } from "@/utils";

type SearchStateOptions = {
  clamp?: boolean;
  min?: number;
  max?: number;
};

export default class SearchState<T extends string | number> {
  #state = $state<T>() as T;
  options: SearchStateOptions = {};

  constructor(val: T, options?: SearchStateOptions) {
    this.#state = val;
    if (options) {
      this.options = options;
    }
  }

  get value() {
    return this.#state;
  }

  set value(val: T) {
    if (Number.isNaN(Number(val))) {
      this.#state = val;
      return;
    }

    if (this.options.clamp === true && this.options.min !== undefined && this.options.max !== undefined) {
      this.#state = clamp(Number(val), this.options.min, this.options.max) as T;
      return;
    }

    this.#state = Number(val) as T;
  }
}
