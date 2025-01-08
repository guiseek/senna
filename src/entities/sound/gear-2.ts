import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear2 extends Gear {
  readonly min = 500

  readonly max = 1000

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.6 + normalizedRpm * 0.2)
    this.setVolume(0.2 + normalizedRpm * 0.5)
  }
}
