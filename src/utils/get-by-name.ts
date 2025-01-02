import {Group} from 'three'

export function getByName<R>(group: Group, name: string) {
  const child = group.getObjectByName(name)
  if (!child) throw `${name} not found in ${group.name}`
  return child as R
}
