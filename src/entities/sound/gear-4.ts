import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear4 extends Gear {
  readonly min = 3000

  readonly max = 4400

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setVolume(0.3 + normalizedRpm * 0.4)
    this.setPlaybackRate(0.6 + normalizedRpm * 0.15)
  }
}
