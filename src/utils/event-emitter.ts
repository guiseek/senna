export interface Callback<T> {
  (value: T): void
  once?: boolean
}

export class EventEmitter<T> {
  #listeners = new Map()

  on<K extends keyof T>(type: K, callback: Callback<T[K]>) {
    const listeners = this.#getListeners(type)
    this.#listeners.set(type, listeners.add(callback))
    return {off: () => this.off(type, callback)}
  }

  once<K extends keyof T>(type: K, callback: Callback<T[K]>) {
    callback.once = true
    this.on(type, callback)
  }

  // prettier-ignore˝
  emit<K extends keyof T>(
    type: K,
    value: T[K] extends void ? never : T[K]
  ): void
  emit<K extends keyof T>(type: K, value: T[K]) {
    const listeners = this.#getListeners(type)
    for (const fn of listeners) {
      if (fn.once) this.off(type, fn)
      fn(value)
    }
  }

  off<K extends keyof T>(type: K, callback: Callback<T[K]>) {
    const listeners = this.#getListeners(type)
    listeners.delete(callback)
    this.#listeners.set(type, listeners)
  }

  #getListeners<K extends keyof T>(type: K): Set<Callback<T[K]>> {
    return this.#listeners.get(type) ?? new Set()
  }
}
