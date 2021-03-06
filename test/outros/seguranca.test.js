const chai = require('chai')
const joi = require('@hapi/joi')

describe('SEGURANÇA', () => {
  it('Validar presença de headers de segurança', async () => {
    const rotas = ['/produtos', '/usuarios', '/carrinhos']
    const rotaAleatoria = rotas[Math.floor(Math.random() * rotas.length)]
    const { headers } = await request.get(rotaAleatoria).expect(200)

    chai.assert.include(headers, {
      'x-dns-prefetch-control': 'off',
      'x-frame-options': 'SAMEORIGIN',
      'strict-transport-security': 'max-age=15552000; includeSubDomains',
      'x-download-options': 'noopen',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'content-type': 'application/json; charset=utf-8'
    })

    joi.assert(headers, joi.object().keys({
      'x-dns-prefetch-control': joi.any(),
      'x-frame-options': joi.any(),
      'strict-transport-security': joi.any(),
      'x-download-options': joi.any(),
      'x-content-type-options': joi.any(),
      'x-xss-protection': joi.any(),
      'content-type': joi.any(),
      'content-length': joi.any(),
      etag: joi.any(),
      date: joi.any(),
      connection: joi.any()
    }).required())
  })
})
