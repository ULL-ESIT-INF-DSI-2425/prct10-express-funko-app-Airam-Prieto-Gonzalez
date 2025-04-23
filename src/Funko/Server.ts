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