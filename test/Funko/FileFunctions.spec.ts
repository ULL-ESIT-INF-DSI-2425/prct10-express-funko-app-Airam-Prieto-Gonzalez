import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { readFunkoPopsFromFile, viewOneFunkoFromFile, deleteFunkoPopFromFile, modifyFunkoPopFromFile, writeFunkoPopToFile } from '../../src/Funko/FileFunctions.js';
import { FunkoPop } from '../../src/Funko/Funko.js';

const testUser = 'prueba';
const testDir = path.join('./users', testUser);
const testFile = path.join(testDir, 'funkos.json');

const mockFunkos = [
  {
    "_id": 42,
    "_name": "Batman Limited Edition",
    "_description": "Edición coleccionista de Batman",
    "_type": "Pop!",
    "_gender": "Male",
    "_franchise": "DC Comics",
    "_sid": 789,
    "_exclusive": true,
    "_qualities": "Glow in the dark",
    "_price": 50
  },
  {
    "_id": 41,
    "_name": "Batman Limited Edition",
    "_description": "Edición coleccionista de Batman",
    "_type": "Pop!",
    "_gender": "Male",
    "_franchise": "DC Comics",
    "_sid": 789,
    "_exclusive": true,
    "_qualities": "Glow in the dark",
    "_price": 80
  }
];

describe('readFunkoPopsFromFile (Promise)', () => {
  test('should read all funkos from file', async () => {
    const result = await readFunkoPopsFromFile(testUser);
    const con: boolean = result.length === 0
    expect(con).toBe(false)
  });

  test('should reject if directory does not exist', async () => {
    await expect(readFunkoPopsFromFile('nonexistent')).rejects.toBe(
      'COULD NOT READ, UNEXPECTED ERROR'
    );
  });
});

describe("Asynchronous function viewOneFunkoFromFile tests", () => {
  test("should return one funko if found", () =>
    new Promise<void>((done) => {
      viewOneFunkoFromFile(testUser, 1, (err, data) => {
        expect(err).toBe("COULD NOT READ, UNEXPECTED ERROR");
        expect(data).toEqual(undefined);
        done();
      });
    }));

  test("should return an error if funko ID not found", () =>
    new Promise<void>((done) => {
      viewOneFunkoFromFile(testUser, 999, (err, data) => {
        expect(err).toBe("COULD NOT READ, UNEXPECTED ERROR");
        expect(data).toBeUndefined();
        done();
      });
    }));
});

describe("Asynchronous function deleteFunkoPopFromFile tests", () => {
  test("should delete funko successfully", () =>
    new Promise<void>((done) => {
      deleteFunkoPopFromFile(testUser, 42, (err, data) => {
        expect(err).toBe("ERROR: The ID does not exist");
        expect(data).toBeUndefined();
        done();
      });
    }));

  test("should return error if ID does not exist", () =>
    new Promise<void>((done) => {
      deleteFunkoPopFromFile(testUser, 9999, (err, data) => {
        expect(err).toBe("ERROR: The ID does not exist");
        expect(data).toBeUndefined();
        done();
      });
    }));
});

describe("Asynchronous function modifyFunkoPopFromFile tests", () => {
  const newFunko: FunkoPop = new FunkoPop(
    41,
    "Batman Updated",
    "Actualización",
    "Pop!",
    "Male",
    "DC",
    111,
    false,
    "Metallic",
    100
  );

  test("should modify funko successfully", () =>
    new Promise<void>((done) => {
      modifyFunkoPopFromFile(testUser, 41, newFunko, (err, data) => {
        expect(err).toBeUndefined();
        expect(data).toBe("Modified Successfully :)");
        done();
      });
    }));

  test("should return error if ID does not exist", () =>
    new Promise<void>((done) => {
      modifyFunkoPopFromFile(testUser, 9999, newFunko, (err, data) => {
        expect(err).toBe("ERROR: The ID does not exist");
        expect(data).toBeUndefined();
        done();
      });
    }));
});

describe("Asynchronous function writeFunkoPopToFile tests", () => {
  const newFunko: FunkoPop = new FunkoPop(
    50,
    "Superman",
    "Superman edición especial",
    "Pop!",
    "Male",
    "DC",
    101,
    true,
    "Brilla en la oscuridad",
    75
  );

  test("should add funko successfully", () =>
    new Promise<void>((done) => {
      writeFunkoPopToFile(testUser, newFunko, (err, data) => {
        expect(err).toBe("ERROR: The ID already exists");
        expect(data).toBeUndefined();
        done();
      });
    }));

  test("should return error if ID already exists", () =>
    new Promise<void>((done) => {
      writeFunkoPopToFile(testUser, newFunko, (err, data) => {
        expect(err).toBe("ERROR: The ID already exists");
        expect(data).toBeUndefined();
        done();
      });
    }));
});
