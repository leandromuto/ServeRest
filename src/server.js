#!/usr/bin/env node

'use strict'

const colors = require('colors')
const debug = require('debug')('nodestr:server')
const http = require('http')
const open = require('open')

const { conf } = require('./utils/conf')
const DEFAULT_PORT = 3000
const { DOC_URL } = require('./utils/constants')

const argv = require('yargs')
  .default({
    porta: conf.porta,
    timeout: conf.tokenTimeout
  })
  .boolean(['nobearer', 'nodoc', 'nosec'])
  .number(['timeout', 'porta'])
  .alias('p', 'porta')
  .alias('t', 'timeout')
  .alias('d', 'nodoc')
  .alias('b', 'nobearer')
  .alias('s', 'nosec')
  .alias('h', 'help')
  .alias('v', 'version')
  .usage('Ajuda do ServeRest')
  .usage('\nModo de uso: npx serverest <opcao>')
  .describe('p', 'Porta que será utilizada (default: 3000)')
  .describe('t', 'Timeout da autenticação em segundos (default: 600)')
  .describe('d', 'Desabilitar o início automático da documentação')
  .describe('b', 'Não retornar "Bearer" no authorization de /login')
  .describe('s', 'Desabilitar os headers de segurança na resposta')
  .example('npx serverest', 'Utilizar porta e timeout padrão')
  .example('npx serverest --nodoc', 'Documentação não abrirá')
  .example('npx serverest --timeout 3600', 'Token de autenticação terá 1h de duração')
  .example('npx serverest --porta 3500', 'Será iniciado na porta 3500')
  .example('npx serverest -s -p 4200 -t 120 -b', 'É possível combinar as opções')
  .help('h')
  .epilog('Acesse serverest.js.org para ver as rotas disponíveis')
  .epilog('Precisa de ajuda?')
  .epilog('Abra uma issue em github.com/PauloGoncalvesBH/ServeRest/issues')
  .argv

conf.tokenTimeout = argv.timeout
conf.semHeaderDeSeguranca = argv.nosec
conf.semBearer = argv.nobearer

const app = require('./app')

const port = normalizePort(argv.porta)
conf.porta = port
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

console.log(colors.white.bold(`\nServeRest está em execução na porta ${port}`))
console.log(colors.white.bold('Dúvidas?'), colors.yellow.bold('npx serverest -h'))
console.log(colors.cyan.bold('Feito com'), colors.red.bold('♥'), colors.cyan.bold('para todos os QAs\n'))

if (!argv.nodoc) {
  open(DOC_URL)
}

function normalizePort (val) {
  const port = parseInt(val, 10)

  const isNumber = !isNaN(port)
  const isInPortRange = port > -1 && port < 65536
  if (isNumber && isInPortRange) {
    return port
  }

  return DEFAULT_PORT
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Porta ' + port

  switch (error.code) {
    case 'EACCESS':
      console.error(bind, 'requires elevated privileges')
      process.exit(1)

    case 'EADDRINUSE':
      console.error(bind, `já está em uso.
Feche o programa/serviço que está usando a porta ${port} ou execute o ServeRest em outra porta.
Execute 'npx serverest -h' para saber como executar em outra porta.`)
      process.exit(1)

    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port

  debug('Listening on ' + bind)
}
