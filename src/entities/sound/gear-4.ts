import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear4 extends Gear {
  readonly min = 1600

  readonly max = 2200

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.4 + normalizedRpm * 0.2)
    this.setVolume(0.2 + normalizedRpm * 0.7)
  }
}
