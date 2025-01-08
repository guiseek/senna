import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear6 extends Gear {
  readonly min = 5100

  readonly max = 7200

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.4 + normalizedRpm * 0.1)
    this.setVolume(0.5 + normalizedRpm * 0.5)
  }
}
