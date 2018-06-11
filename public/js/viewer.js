function urlSearchParams() {
  const query = window.location.search.replace('?', '')
  return query.split('&').reduce(function(memo, param) {
    const optionTuple = param.split('=')
    const key = decodeURIComponent(optionTuple[0])
    const value = decodeURIComponent(optionTuple[1])
    memo[key] = value
    return memo
  }, {})
}

const options = urlSearchParams()
const container = document.getElementsByTagName('canvas')[0]

container.width = options.width
container.height = options.height

// See also https://code.google.com/p/jsc3d/wiki/StartupParameters
const viewer = new JSC3D.Viewer(container)
viewer.setParameter('SceneUrl', options.url)
viewer.setParameter('ModelColor', '#' + options.color)
viewer.setParameter('InitRotationX', options.x)
viewer.setParameter('InitRotationY', options.y)
viewer.setParameter('InitRotationZ', options.z)
viewer.setParameter('RenderMode', 'flat') // can be 'smooth'
viewer.setParameter('Renderer', 'webgl')
viewer.setParameter('Background', 'off')
viewer.setParameter('ProgressBar', 'off')
viewer.onloadingcomplete = function() {
  window._loadingComplete = true
}

console.log('JSC3D init ' + options.url)
viewer.init()
viewer.update()

window.viewer = viewer // Make it accessible to the browser
