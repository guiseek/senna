export const keys = <T extends object>(data: T) => {
  return Object.keys(data) as (keyof T)[]
}
