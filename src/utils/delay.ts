import {async} from './async'

export const delay = (ms = 1000) => {
  return async((resolve) => {
    setTimeout(resolve, ms)
  })
}
