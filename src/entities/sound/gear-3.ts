import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear3 extends Gear {
  readonly min = 1700

  readonly max = 3100

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm);
    this.setVolume(0.3 + normalizedRpm * 0.3);
    this.setPlaybackRate(0.7 + normalizedRpm * 0.2);
  }
}
