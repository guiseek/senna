import {createProgress} from '../factories'
import {AudioListener} from 'three'
import {Loader} from '../core'
import {
  Engine,
  Gear1,
  Gear2,
  Gear3,
  Gear4,
  Gear5,
  Gear6,
  GearIdle,
  GearReverse,
} from '../entities'

export const loadEngine = async (listener: AudioListener) => {
  const loader = Loader.getInstance()

  return Promise.all([
    loader.audio.loadAsync(
      'reverse.ogg',
      createProgress('Gear Reverse AudioBuffer')
    ),
    loader.audio.loadAsync('idle.ogg', createProgress('Gear Idle AudioBuffer')),
    loader.audio.loadAsync('low.ogg', createProgress('1ª Gear AudioBuffer')),
    loader.audio.loadAsync('low.ogg', createProgress('2ª Gear AudioBuffer')),
    loader.audio.loadAsync('med.ogg', createProgress('3ª Gear AudioBuffer')),
    loader.audio.loadAsync('med.ogg', createProgress('4ª Gear AudioBuffer')),
    loader.audio.loadAsync('high.ogg', createProgress('5ª Gear AudioBuffer')),
    loader.audio.loadAsync('high.ogg', createProgress('6ª Gear AudioBuffer')),
  ]).then((buffers) => {
    return new Engine([
      new GearReverse(listener, buffers[0]),
      new GearIdle(listener, buffers[1]),
      new Gear1(listener, buffers[2]),
      new Gear2(listener, buffers[3]),
      new Gear3(listener, buffers[4]),
      new Gear4(listener, buffers[5]),
      new Gear5(listener, buffers[6]),
      new Gear6(listener, buffers[7]),
    ])
  })
}
