import {
  Gear1,
  Gear2,
  Gear3,
  Gear4,
  Gear5,
  Gear6,
  GearIdle,
  GearReverse,
} from './sound'

export class Engine {
  #current = 0

  get current() {
    return this.#current
  }

  constructor(
    private gears: [
      GearReverse,
      GearIdle,
      Gear1,
      Gear2,
      Gear3,
      Gear4,
      Gear5,
      Gear6
    ]
  ) {}

  update(rpm: number) {
    const currentGear = this.gears[this.#current]

    currentGear.update(rpm)

    if (rpm > currentGear.max && this.#current < this.gears.length - 1) {
      this.#changeGear(this.#current + 1)
    }

    if (rpm < currentGear.min && this.#current > 0) {
      this.#changeGear(this.#current - 1)
    }
  }

  #changeGear(newGearIndex: number) {
    const currentGear = this.gears[this.#current]
    const newGear = this.gears[newGearIndex]

    currentGear.stop()
    this.#current = newGearIndex

    newGear.play()
  }
}
