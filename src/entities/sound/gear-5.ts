import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear5 extends Gear {
  readonly min = 4300

  readonly max = 5200

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.5 + normalizedRpm * 0.1)
    this.setVolume(0.4 + normalizedRpm * 0.4)
  }
}
