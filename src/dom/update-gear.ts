const gearCurrent = new Text()

domGearCurrent.appendChild(gearCurrent)

export const updateGear = (current: number) => {
  gearCurrent.textContent = current.toString()
}
