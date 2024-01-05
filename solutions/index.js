import net from 'node:net'
import fs from 'node:fs'
import fsp from 'node:fs/promises'

// # EJERCICIO 1
export const ping = (ip, callback) => {
  const startTime = process.hrtime()

  const client = net.connect({ port: 80, host: ip }, () => {
    client.end()
    const info = { time: process.hrtime(startTime), ip }
    return callback(null, info)
  })

  client.on('error', (err) => {
    // throw err
    client.end()
    return callback(err, null)
  })
}

ping('midu.dev', (err, info) => {
  if (err) console.error(err)
  console.log(info)
})

// # EJERCICIO 2
// @midudev tengo algunas dudas, vi en algunos códigos que usan un return con la ejecución del callback y otros que no lo usan, personalmente me costumbre a usar los returns al ejecutar el cb para asegurarme de detener las ejecuciones de las funciones en las que se usan, pero no si sea algo necesario o si marca la diferencia.
export function obtenerDatosPromise ({ time }) {
  return new Promise((resolve, reject) => {
    // @midudev y una cosa más, vi algunos casos que usan directamente la ejecución del resolve() en el setTimeout y me confunde un poco ya que pienso que esto debería de dar un error ya que se debería de ejecutar antes de lo esperado ya que se ejecuta y no se proporciona el valor de resolve con tal, y la única manera que se me ocurra que sea posible que funcione esto, es que resolve sea una función que devuelve otra función sin embargo no me cuadra ya que esta comunmente la veo "retornando valores" para las promesas.
    setTimeout(() => {
      resolve({ data: 'datos importantes' })
    }, time)
  })
}

// # EJERCICIO 3
// Que hace el código? : lee el archivo 'input.txt' con el fin de procesar su contenido cambiandolo a mayusculas para luego crear un nuevo archivo 'output.txt' con el contenido ya procesado.
export function procesarArchivo (callback) {
  fs.readFile(
    'input.txt',
    'utf8',
    (error, contenido) => {
      if (error) {
        console.error('Error leyendo archivo:', error.message)
        return callback(error)
      }

      const textoProcesado = contenido.toUpperCase()

      fs.writeFile('output.txt', textoProcesado, (error) => {
        if (error) {
          console.error('Error guardando archivo:', error.message)
          return callback(error)
        }

        console.log('Archivo procesado y guardado con éxito')
        return callback(null, contenido)
      })
    }
  )
}

export async function procesarArchivoPromise () {
  // tu código aquí

  // # secio-note(1): se puede usar tanto el fsp directamente tanto de 'node:fs/promises' para poder usar promesas, o desde 'node:fs' usandolo de esta manera fs.promises.<metodo>
  const contenido = await fsp.readFile('input.txt', 'utf8').catch((error) => {
    console.error('Error leyendo archivo:', error.message)
    return ''
  })
  // # secio-note(2): a la hora de usar await es necesario controlar los errores con un trycatch estos pueden ser granulares o también más generales aunque es mejor siempre ser granular, y estos también pueden usarse con la función de promesas catch() ya que al fin y al cabo también son promesas
  const textoProcesado = contenido.toUpperCase()

  try {
    await fsp.writeFile('output.txt', textoProcesado)
  } catch (error) {
    console.error('Error guardando archivo:', error.message)
    throw error
  }
}

// # EJERCICIO 4
export async function leerArchivos () {
  // # secio-note(3): recuerda puedes usar Promise.all o Promise.allSettled rescatando la diferencia del ultimo que en caso de fallar esta no explota y te devuelve las que si se cumplieron, al contrario del primero que en caso de fallar uno esta hace boom. Recordar que con ambos métodos el orden en el que colocas las entradas asyncronas sera el orden en el que te retornara las respuestas.

  const results = await Promise.allSettled([
    fsp.readFile('archivo1.txt', 'utf8'),
    fsp.readFile('archivo2.txt', 'utf8'),
    fsp.readFile('archivo3.txt', 'utf8')
  ])

  const message = results
    .filter((result) => result.status === 'fulfilled')
    .map((fileContent) => fileContent.value)
    .join(' ')

  return message
}

// # EJERCICIO 5
export async function delay (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
