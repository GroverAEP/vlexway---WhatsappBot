// gameCommand.js
import fs from "fs"

// Almacenamiento simple en memoria (puedes luego migrarlo a base de datos)
let players = {}

export async function handlerGameCommand({sock,msg,sender,text}) {
  const chatId = sender
  const userId = msg.key.participant || msg.key.remoteJid

  console.log(chatId)
  console.log(userId)

  //Registro de usuarios para el juego.

  if (!players[userId]) {
    players[userId] = {
      level: 1,
      score: 0,
      question: null,
      answer: null
    }

    // await sock.sendMessage(chatId)
  } 

  const user = players[userId]

  
    //////////////////////////////////////////////////////////////
    //// Comando jugar: Comando para iniciar el juego
    //////////////////////////////////////////////////////////////

  // ✅ Comando: iniciar juego
  if (text === "!jugar") {
    const { question, answer } = generateQuestion(user.level)
    user.question = question
    user.answer = answer


    const msgRemovedTiming = await sock.sendMessage(chatId, {
      text: `🧮 *Nivel ${user.level}*\n${question}\n\nResponde con:\n👉 *!responder <tu_respuesta>*, \nEsta pregunta se eliminara en 15 segundos`
    })
    
    // setTimeout( async() => {
      
    //   await sock.sendMessage(chatId, {
    //     delete: msgRemovedTiming.key
    //   })
      
    // }, 15000);


  }

    //////////////////////////////////////////////////////////////
    //// Comando responder: Comando para responder con respuesta
    //////////////////////////////////////////////////////////////

  // ✅ Comando: responder
  else if (text.startsWith("!responder")) {
    const userAnswer = parseFloat(text.split(" ")[1])

    if (user.question === null) {
      await sock.sendMessage(chatId, { text: "❌ No hay pregunta activa. Usa *!jugar* para comenzar." })
      return
    }

    if (isNaN(userAnswer)) {
      await sock.sendMessage(chatId, { text: "⚠️ Debes responder con un número. Ejemplo: *!responder 12*" })
      return
    }
    
    //////////////////////////////////////////
    //// Metodo Ganador: Respuesta Correcta
    //////////////////////////////////////////
    if (userAnswer === user.answer) {
      user.score += 10
      user.level += 1
      await sock.sendMessage(chatId, {
        text: `✅ ¡Correcto!\n Jugador: ${msg.pushName} \n🎯 Puntos: *${user.score}*\n⬆️ Nivel siguiente: *${user.level}*\n\nEscribe *!jugar* para continuar.`,
        quoted: msg,
      })
      user.question = null
      user.answer = null
    } else {
      user.score = Math.max(0, user.score - 5)
      await sock.sendMessage(chatId, {
        text: `❌ Incorrecto. La respuesta era *${user.answer}*\n Jugador ${msg.pushName} \n💀 Puntos: *${user.score}*\n\nVuelve a intentar con *!jugar*.`,
        quoted: msg
      })
      user.question = null
      user.answer = null
    }
  }

  // ✅ Comando: mostrar nivel actual
  else if (text === "!nivel") {
    await sock.sendMessage(chatId, {
      text: `🎯 Tu nivel actual: *${user.level}*\n💎 Puntos: *${user.score}*\nEscribe *!jugar* para seguir jugando.`
    })
  }
}

// 🔢 Generador de preguntas según nivel
function generateQuestion(level) {
  const operations = ["+", "-", "*", "/"]
  let num1, num2, op, question, answer

  // Aumenta rango según nivel
  const max = 5 + level * 3
  num1 = Math.floor(Math.random() * max) + 1
  num2 = Math.floor(Math.random() * max) + 1
  op = operations[Math.floor(Math.random() * Math.min(operations.length, 1 + Math.floor(level / 3)))]

  switch (op) {
    case "+":
      answer = num1 + num2
      break
    case "-":
      answer = num1 - num2
      break
    case "*":
      answer = num1 * num2
      break
    case "/":
      answer = parseFloat((num1 / num2).toFixed(2))
      break
    case "%":
      answer = num1 % num2
  }

  question = `💡 ¿Cuánto es *${num1} ${op} ${num2}*?`
  return { question, answer }
}
