export const inner = {
  get width() {
    return innerWidth
  },
  get height() {
    return innerHeight
  },
  get ratio() {
    return this.width / this.height
  },
}
