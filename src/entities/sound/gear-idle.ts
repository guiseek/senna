import {AudioListener} from 'three'
import {Gear} from '../../core'

export class GearIdle extends Gear {
  readonly min = 0

  readonly max = 1

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)
  }

  update(_rpm: number) {
    this.setPlaybackRate(0.8)
    this.setVolume(0.2)
  }
}
