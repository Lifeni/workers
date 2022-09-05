import Error from './app/error.html'
import Ok from './app/ok.html'
import Submit from './app/submit.html'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const method = request.method
    const path = url.pathname.slice(1)

    if (!path) {
      switch (method) {
        case 'GET': {
          return new Response(Submit, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
          })
        }
        case 'POST': {
          try {
            const form = await request.formData()
            const slug = form.get('slug')
            const encode = encodeURIComponent(slug)
            const link = form.get('link')
            await env.urls.put(encode, link)
            return new Response(
              Ok.replaceAll('{{ slug }}', slug)
                .replaceAll('{{ link }}', link)
                .replaceAll('{{ target }}', `https://iokl.link/${slug}`),
              {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' },
              }
            )
          } catch (error) {
            console.log(error)
            return new Response(Error, {
              headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            })
          }
        }
        default: {
          return new Response(null, { status: 405 })
        }
      }
    } else if (path === 'favicon.svg') {
      if (method !== 'GET') return new Response(null, { status: 405 })
      return new Response(Favicon, {
        headers: { 'Content-Type': 'image/svg+xml' },
      })
    } else {
      if (method !== 'GET') return new Response(null, { status: 405 })
      const target = await env.urls.get(path)
      if (target) return Response.redirect(target, 302)
      return new Response(null, { status: 404 })
    }
  },
}

const Favicon = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="1024" rx="512" fill="url(#paint0_linear_2195_2)"/>
<defs>
<linearGradient id="paint0_linear_2195_2" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
<stop stop-color="#CE9FFC"/>
<stop offset="1" stop-color="#7367F0"/>
</linearGradient>
</defs>
</svg>
`
