addEventListener('fetch', event => {
  try {
    if (checkOrigins(event.request))
      event.respondWith(handleRequest(event.request))
    else event.respondWith(new Response(null, { status: 403 }))
  } catch (error) {
    console.error(error)
    event.respondWith(new Response(null, { status: 500 }))
  }
})

const origins = ['lifeni.life', 'localhost']

/**
 * 检查来源
 * @param {Request} request
 * @returns {Boolean}
 */
const checkOrigins = request => {
  for (const origin of origins)
    if (origin.indexOf(request.headers.get('Origin') !== -1)) return true

  return false // 是否拒绝所有无 Origin 请求
}

/**
 * 处理请求
 * @param {Request} request
 * @returns {Response}
 */
const handleRequest = async request => {
  const path = new URL(request.url).pathname
  if (path === '/') return new Response('🚇')

  const results = await fetch(`https:/${path}`)
  const response = new Response(await results.text(), results)
  response.headers.set(
    'Access-Control-Allow-Origin',
    request.headers.get('Origin') || '*'
  )
  response.headers.append('Vary', 'Origin')

  return response
}
