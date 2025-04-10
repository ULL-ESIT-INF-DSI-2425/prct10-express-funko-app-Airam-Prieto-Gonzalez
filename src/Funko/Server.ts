// import net from 'net';
// import { FunkoPop } from './Funko.js';
// import { writeFunkoPopToFile, readFunkoPopsFromFile, deleteFunkoPopFromFile, viewOneFunkoFromFile, modifyFunkoPopFromFile} from './FileFunctions.js'

// /**
//  * Port to listen to
//  */
// const PORT = 60300;



// /**
//  * Server instance
//  */
// const server = net.createServer((socket) => {
//   console.log('Cliente conectado');
//   let data_buffer = '';
//   socket.on('data', (data) => {
//     try {
//       data_buffer += data.toString();
//       const message = JSON.parse(data_buffer.toString());
//       if (message) {   
//         switch (message.action) {
//           case 'add':
//                 // Crear un nuevo FunkoPop
//                 const newFunko = new FunkoPop(
//                   message.params.id,
//                   message.params.name,
//                   message.params.description,
//                   message.params.type,
//                   message.params.gender,
//                   message.params.franchise,
//                   message.params.sid,
//                   message.params.exclusive,
//                   message.params.qualities,
//                   message.params.price
//                 );
//                 writeFunkoPopToFile(message.params.user, newFunko);
//                 socket.write(JSON.stringify({ message: 'Funko added' }));
                
//                 break;
//                 case 'view':
//                 readFunkoPopsFromFile(message.params.user, (result) => {
//                   socket.write(JSON.stringify({ message: `Funkos of ${message.params.user}:${result}` }));
//                   socket.end();
//                 });
                
//                 break;
//                 case 'remove':
//                 deleteFunkoPopFromFile(message.params.user, message.params.id);
//                 socket.write(JSON.stringify({ message: 'Funko removed' }));
                
//                 break;
//                 case 'viewOne':
//                 viewOneFunkoFromFile(message.params.user, message.params.id, (result) => {
//                   socket.write(JSON.stringify({ message: `Funko of ${message.params.user}:\n${result}` }));
//                   socket.end()
//                 });
                
//                 break;
//                 case 'modify':
//                 const modifiedFunko = new FunkoPop(
//                   message.params.id,
//                   message.params.name,
//                   message.params.description,
//                   message.params.type,
//                   message.params.gender,
//                   message.params.franchise,
//                   message.params.sid,
//                   message.params.exclusive,
//                   message.params.qualities,
//                   message.params.price
//                 );
//                 modifyFunkoPopFromFile(message.params.user, message.params.id, modifiedFunko);
//                 socket.write(JSON.stringify({ message: 'Funko modified' }));
                
//                 break;
          
//           default:
//             socket.write(JSON.stringify({ error: 'Evento no reconocido' }));
            
//         }
//         data_buffer = '';
//       } else {
//         socket.write(JSON.stringify({ error: 'Formato incorrecto' }));
//       }
//     } catch (error) {
//       socket.write(JSON.stringify({ error: 'Error en el procesamiento' }));
//       console.log('Error en el procesamiento:', error);
//     }
//   });

//   socket.on('end', () => {
//     console.log('Cliente desconectado');
//   });

//   socket.on('error', (err) => {
//     console.error('Error en la conexión:', err.message);
//   });
// });

// /**
//  * Start the server
//  */
// server.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

import express from 'express';
import { FunkoPop } from './Funko.js';
import { writeFunkoPopToFile, readFunkoPopsFromFile, deleteFunkoPopFromFile, viewOneFunkoFromFile, modifyFunkoPopFromFile} from './FileFunctions.js'
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user: string = "prueba"

/**
 * Detects the get action
 */
app.get('/funko/readAll', async (_, res) => {
  try {
    const funkos = await readFunkoPopsFromFile("prueba");
    res.send({ success: true, message: funkos });
  } catch (error) {
    res.send({ success: false, message: error });
  }
});

/**
 * Detects the get action
 */
app.get('/funko/readOne', (req, res) => {
  viewOneFunkoFromFile(user, Number(req.query.id), (err, data) => {
    const result = {
      success: err,
      message: data
    }
    res.send(result)
  })
});

/**
 * Detects the post action
 */
app.post('/funko/add', (req, res) => {
  console.log(req.body)
  writeFunkoPopToFile(user, req.body.funko, (err, data) => {
    const result = {
      success: err,
      message: data
    }
    res.send(result)
  })
});

/**
 * Detects the patch action
 */
app.patch('/funko/modify', (req, res) => {
  modifyFunkoPopFromFile(user, Number(req.query.id), req.body.funko, (err, data) => {
    const result = {
      success: err,
      message: data
    }
    res.send(result)
  })
});

/**
 * Detects the delete action
 */
app.delete('/funko/delete', (req, res) => {
  deleteFunkoPopFromFile(user, Number(req.query.id), (err, data) => {
    const result = {
      success: err,
      message: data
    }
    res.send(result)
  })
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});