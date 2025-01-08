import {AudioListener} from 'three'
import {Gear} from '../../core'

export class GearReverse extends Gear {
  readonly min = -100

  readonly max = 0

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(Math.abs(rpm))
    this.setVolume(0.1 + normalizedRpm * 0.5)
    this.setPlaybackRate(0.6 + normalizedRpm * 0.4)
  }
}
