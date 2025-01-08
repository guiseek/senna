export const interval = (callback: VoidFunction, ms = 100) => {
  const ref = setInterval(callback, ms)
  return {cancel: () => clearInterval(ref)}
}
