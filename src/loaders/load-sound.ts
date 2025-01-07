import {SoundIdle, SoundRun, SoundRunning, SoundStart} from '../entities'
import {createProgress} from '../factories'
import {AudioListener} from 'three'
import {Loader} from '../core'

export const loadSound = async () => {
  const loader = Loader.getInstance()

  const buffer = {
    start: await loader.audio.loadAsync(
      'start.wav',
      createProgress('Start AudioBuffer')
    ),
    idle: await loader.audio.loadAsync(
      'idle.wav',
      createProgress('Idle AudioBuffer')
    ),
    run: await loader.audio.loadAsync(
      'run.wav',
      createProgress('Run AudioBuffer')
    ),
    running: await loader.audio.loadAsync(
      'running.wav',
      createProgress('Running AudioBuffer')
    ),
  }

  const listener = new AudioListener()

  const start = new SoundStart(listener, buffer.start)
  const idle = new SoundIdle(listener, buffer.idle)
  const run = new SoundRun(listener, buffer.run)
  const running = new SoundRunning(listener, buffer.running)

  return {listener, start, idle, run, running}
}
