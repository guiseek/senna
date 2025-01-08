import {Audio, AudioListener} from 'three'

export abstract class Gear extends Audio {
  abstract readonly min: number

  abstract readonly max: number

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener)
    this.setBuffer(buffer)
  }

  abstract update(rpm: number): void

  protected normalizeRpm(rpm: number) {
    return Math.min(1, Math.max(0, (rpm - this.min) / (this.max - this.min)))
  }
}
