import {Audio, AudioListener} from 'three'

export class SoundRun extends Audio {
  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener)

    this.setBuffer(buffer)
    this.setLoop(false)
  }
}
