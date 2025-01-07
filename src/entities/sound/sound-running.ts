import {Audio, AudioListener} from 'three'

export class SoundRunning extends Audio {
  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener)

    this.setPlaybackRate(0.8)
    this.setBuffer(buffer)
    this.setVolume(0.8)
    this.setLoop(true)
  }

  update(rpm: number) {
    const minRPM = 500
    const maxRPM = 4000

    const clampedRPM = Math.max(minRPM, Math.min(maxRPM, rpm))

    const playbackRate = 0.8 + ((clampedRPM - minRPM) / (maxRPM - minRPM)) * 1.2

    const volume = 0.4 + ((clampedRPM - minRPM) / (maxRPM - minRPM)) * 0.6

    this.setPlaybackRate(playbackRate)
    this.setVolume(volume)
  }
}
