import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear6 extends Gear {
  readonly min = 2800

  readonly max = 3400

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.4 + normalizedRpm * 0.1)
    this.setVolume(0.2 + normalizedRpm * 0.9)
  }
}
