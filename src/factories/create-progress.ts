export const createProgress = (name: string) => {
  const element = document.createElement('progress')
  const item = document.createElement('li')
  const text = new Text('0')
  element.max = 100

  const callback = ({loaded, total}: ProgressEvent) => {
    element.value = (loaded / total) * 100
    text.textContent = ` - ${element.value.toFixed()}%`
    if (element.value >= 100) item.remove()
  }

  item.append(element, new Text(name), text)

  domProgressList.appendChild(item)

  return callback
}
