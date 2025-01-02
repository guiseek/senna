import {Clock} from 'three'

export const createLoop = (callbackFn: (delta: number) => void) => {
  let animation: number | null = null
  const clock = new Clock()

  const animateFn = () => {
    const delta = clock.getDelta()

    callbackFn(delta)

    return requestAnimationFrame(animateFn)
  }

  return {
    animate() {
      animation = animateFn()
    },
    cancel() {
      if (animation) {
        cancelAnimationFrame(animation)
      }
      animation = null
    },
    toggle() {
      if (animation) this.cancel()
      else this.animate()
    },
  }
}
