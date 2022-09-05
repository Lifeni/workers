addEventListener('fetch', event => {
  try {
    const url = new URL(event.request.url)
    const target =
      redirects.find(item => item.origin === url.hostname)?.target ||
      'https://lifeni.life'
    event.respondWith(Response.redirect(target, 302))
  } catch (error) {
    console.error(error)
    event.respondWith(new Response(null, { status: 500 }))
  }
})

const redirects = [
  {
    origin: 'dist.run',
    target: 'https://lifeni.life/apps',
  },
  {
    origin: 'dev.lifeni.life',
    target: 'https://lifeni.life/apps',
  },
  {
    origin: 'lab.lifeni.life',
    target: 'https://lifeni.life/explore',
  },
  {
    origin: 'server.lifeni.life',
    target: 'https://lifeni.life/codes',
  },
]
