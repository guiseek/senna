import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear1 extends Gear {
  readonly min = 0

  readonly max = 800

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setPlaybackRate(0.6 + normalizedRpm * 0.2)
    this.setVolume(0.2 + normalizedRpm * 0.4)
  }
}
