import {Audio, AudioListener} from 'three'
import {async, delay} from '../../utils'

export class SoundStart extends Audio {
  constructor(listener: AudioListener, buffer: AudioBuffer) {
    super(listener)

    this.setBuffer(buffer)
    this.setVolume(0.5)
    this.setLoop(false)
  }

  async exec() {
    return async<SoundStart>(async (resolve) => {
      this.play()
      await delay(1500)
      resolve(this)
    })
  }
}
