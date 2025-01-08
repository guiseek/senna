import {AudioListener} from 'three'
import {Gear} from '../../core'

export class Gear2 extends Gear {
  readonly min = 700

  readonly max = 1800

  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener, buffer)
    this.setLoop(true)

    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass' // ou "highpass", "peaking", etc.
    filter.frequency.value = 1000
    filter.Q.value = 1
    this.source?.connect(filter).connect(this.context.destination)
  }

  update(rpm: number) {
    const normalizedRpm = this.normalizeRpm(rpm)
    this.setVolume(0.2 + normalizedRpm * 0.3)
    this.setPlaybackRate(0.6 + normalizedRpm * 0.2)
  }
}
