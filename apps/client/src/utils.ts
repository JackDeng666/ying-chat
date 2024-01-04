export function debounce<T>(callback: (params: T) => void, delay = 200) {
  let timer = 0
  return function (params: T) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback(params)
    }, delay)
  }
}

export function createBlobURL(file: File) {
  if (window.URL) {
    return window.URL.createObjectURL(file)
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(file)
  } else {
    return ''
  }
}

export function getVideoFileCover(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const videoUrl = createBlobURL(file)
    const video = document.createElement('video')
    video.src = videoUrl
    video.currentTime = 0.5
    video.onerror = reject
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas'),
        width = video.videoWidth,
        height = video.videoHeight
      canvas.width = width
      canvas.height = height
      canvas
        .getContext('2d')
        ?.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(blob)
            return
          }
          resolve(new File([blob], 'cover', { type: 'image/jpeg' }))
        },
        'image/jpeg',
        1
      )
    }
  })
}
