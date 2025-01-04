import {Clock} from 'three'

export const createLoop = (callbackFn: (delta: number) => void) => {
  let ref = 0
  let paused = false
  const clock = new Clock()

  const animate = () => {
    ref = requestAnimationFrame(animate)

    if (paused) return

    const delta = clock.getDelta()

    callbackFn(delta)
  }

  const cancel = () => {
    cancelAnimationFrame(ref)
    ref = 0
  }

  const pause = () => {
    paused = !paused
  }

  const stop = () => {
    if (ref) cancel()
    else animate()
  }

  return {
    animate,
    cancel,
    pause,
    stop,
  }
}
