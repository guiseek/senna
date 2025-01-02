import {Callback, EventEmitter} from '../utils'

type ControlKey = 'up' | 'right' | 'down' | 'left' | 'space'

type EventKey = 'p' | 'v' | 's' | 'a' | 'z'

interface InputEventMap {
  change: {key: ControlKey; prev: boolean; next: boolean}
  s: boolean
  p: boolean
  v: boolean
  a: boolean
  z: boolean
}

export class Input {
  private static instance: Input

  #state = {
    up: false,
    right: false,
    down: false,
    left: false,
    space: false,
  }

  get state() {
    return this.#state
  }

  #emitter = new EventEmitter<InputEventMap>()

  static getInstance() {
    if (!this.instance) {
      this.instance = new Input()
    }

    return this.instance
  }

  private constructor() {
    onkeydown = this.#onKeyDown
    onkeyup = this.#onKeyUp
  }

  #onKeyDown = ({code}: KeyboardEvent) => {
    const key = this.#normalize(code)

    if (this.#isControl(key)) {
      if (this.#state[key] !== true) {
        const prev = this.#state[key]
        const next = true

        this.#emitter.emit('change', {key, prev, next})
      }

      this.#state[key] = true
    }

    if (this.#isEvent(key)) {
      this.#emitter.emit(key, true)
    }
  }

  #onKeyUp = ({code}: KeyboardEvent) => {
    const key = this.#normalize(code)

    if (this.#isControl(key)) {
      if (this.#state[key] !== false) {
        const prev = this.#state[key]
        const next = false

        this.#emitter.emit('change', {key, prev, next})
      }

      this.#state[key] = false
    }
  }

  on<K extends keyof InputEventMap>(
    event: K,
    callback: Callback<InputEventMap[K]>
  ) {
    this.#emitter.on(event, callback)
  }

  #isControl(key: string): key is ControlKey {
    return Object.keys(this.#state).includes(key)
  }

  #isEvent(key: string): key is EventKey {
    return ['p', 'v', 's', 'a', 'z'].includes(key)
  }

  #normalize(code: string) {
    return code
      .replace('Arrow', '')
      .replace('Key', '')
      .replace('Digit', '')
      .toLowerCase()
  }
}
