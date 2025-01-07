import {Audio, AudioListener} from 'three'

export class SoundIdle extends Audio {
  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener)

    this.setBuffer(buffer)
    this.setLoop(true)
  }
}
