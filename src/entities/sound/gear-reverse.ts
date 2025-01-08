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
    this.setPlaybackRate(0.7 + normalizedRpm * 0.3)
    this.setVolume(0.2 + normalizedRpm * 0.6)
  }
}
