import fs from "fs";
import { FunkoPop } from "./Funko.js";
import chalk from "chalk";
import path from "path";
import { resourceLimits } from "worker_threads";

/**
 * Method to write a funko instance in a file asynchronously using callbacks.
 * The function parameters remain as in the original; results and errors are handled internally.
 * @param user the user account
 * @param funko the funko to write
 */
export function writeFunkoPopToFile(
  user: string,
  funko: FunkoPop,
  callback: (err: string | undefined, data: string | undefined) => void
): void {
  const dirPath = `./users/${user}`;
  const filePath = path.join(dirPath, "funkos.json");

  // Check if the directory exists
  fs.access(dirPath, fs.constants.F_OK, (errAccess) => {
    if (errAccess) {
      console.log(
        chalk.yellow("WARNING: The path does not exist, creating..."),
      );
      fs.mkdir(dirPath, { recursive: true }, (errMkdir) => {
        if (errMkdir) {
          callback("Error creating directory: " + errMkdir.message, undefined)
          return
        }
        proceedWrite();
      });
    } else {
      proceedWrite();
    }
  });

  function proceedWrite() {
    fs.readFile(filePath, "utf-8", (errRead, data) => {
      let funkos: FunkoPop[] = [];
      // If file doesn't exist or error in reading, consider data as empty.
      if (errRead) {
        data = "";
      }
      if (data.trim().length > 0) {
        try {
          funkos = JSON.parse(data);
        } catch (error: any) {
          callback("Error parsing JSON file", undefined);
          return
        }
      }
      // Check if the funko with the given id already exists
      if (data.includes(`"_id": ${funko.id}`)) {
        callback("ERROR: The ID already exists", undefined);
        return;
      }
      funkos.push(funko);
      fs.writeFile(filePath, JSON.stringify(funkos, null, 2), (errWrite) => {
        if (errWrite) {
          callback("Error writing file: " + errWrite.message, undefined);
          return
        }
        console.log(
          chalk.green(`FunkoPop with ID ${funko.id} added successfully`),
          callback(undefined, "Added Successfully :)")
        );
      });
    });
  }

  // Debido a la naturaleza asíncrona, no se puede retornar el valor de forma inmediata.
  return
}

/**
 * Method to read all the funkos from a file asynchronously using callbacks.
 * The function parameters remain as in the original; the output is shown via console.log.
 * @param user the user account
 */
export function readFunkoPopsFromFile(user: string): Promise<FunkoPop[]> {
  const dirPath = `./users/${user}`;
  const filePath = path.join(dirPath, "funkos.json");

  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (errDir) => {
      if (errDir) {
        return reject("COULD NOT READ, UNEXPECTED ERROR");
      }

      fs.access(filePath, fs.constants.F_OK, (errFile) => {
        if (errFile) {
          return reject("COULD NOT READ, UNEXPECTED ERROR");
        }

        fs.readFile(filePath, "utf-8", (errRead, data) => {
          if (errRead) {
            return reject("COULD NOT READ, UNEXPECTED ERROR");
          }

          try {
            const funkos: FunkoPop[] = JSON.parse(data);
            resolve(funkos);
          } catch (error) {
            reject("Error parsing JSON file");
          }
        });
      });
    });
  });
}

/**
 * Method to delete a funko from a file asynchronously using callbacks.
 * The function parameters remain as in the original; the result is logged to the console.
 * @param user the user account
 * @param id the id of the funko to delete
 */
export function deleteFunkoPopFromFile(
  user: string,
  id: number,
  callback: (err: string | undefined, data: string | undefined) => void
): void {
  const dirPath = `./users/${user}`;
  const filePath = path.join(dirPath, "funkos.json");

  fs.access(dirPath, fs.constants.F_OK, (errDir) => {
    if (errDir) {
      callback("ERROR: The path does not exist", undefined);
      return;
    }
    fs.access(filePath, fs.constants.F_OK, (errFile) => {
      if (errFile) {
        callback("ERROR: The file does not exist", undefined);
        return;
      }
      fs.readFile(filePath, "utf-8", (errRead, data) => {
        if (errRead) {
          callback("Error reading file: " + errRead.message, undefined);
          return;
        }
        let funkos: FunkoPop[];
        try {
          funkos = JSON.parse(data);
        } catch (error: any) {
          callback("Error parsing JSON file", undefined);
          return;
        }
        let found = false;
        for (let i = 0; i < funkos.length; i++) {
          if (funkos[i]._id === id) {
            funkos.splice(i, 1);
            found = true;
            break;
          }
        }
        if (!found) {
          callback("ERROR: The ID does not exist", undefined);
          return;
        }
        fs.writeFile(filePath, JSON.stringify(funkos, null, 2), (errWrite) => {
          if (errWrite) {
            callback("Error writing file: " + errWrite.message, undefined);
            return;
          }
          console.log(
            chalk.green(`FunkoPop with ID ${id} deleted successfully`),
          );
          callback(undefined, "Deleted Successfully")
        });
      });
    });
  });
  return;
}

/**
 * Method to modify a funko from a file asynchronously using callbacks.
 * The function parameters remain as in the original; the modified funko is shown en consola.
 * @param user the user account
 * @param id the id of the funko to modify
 * @param funko the funko to modify
 */
export function modifyFunkoPopFromFile(
  user: string,
  id: number,
  funko: FunkoPop,
  callback: (err: string | undefined, data: string | undefined) => void
): void {
  const dirPath = `./users/${user}`;
  const filePath = path.join(dirPath, "funkos.json");

  fs.access(dirPath, fs.constants.F_OK, (errDir) => {
    if (errDir) {
      callback("ERROR: The path does not exist", undefined);
      return;
    }
    fs.access(filePath, fs.constants.F_OK, (errFile) => {
      if (errFile) {
        callback("ERROR: The file does not exist", undefined);
        return;
      }
      fs.readFile(filePath, "utf-8", (errRead, data) => {
        if (errRead) {
          callback("Error reading file: " + errRead.message, undefined);
          return;
        }
        let funkos: FunkoPop[];
        try {
          funkos = JSON.parse(data);
        } catch (error: any) {
          callback("Error parsing JSON file", undefined);
          return;
        }
        let modified = false;
        for (let i = 0; i < funkos.length; ++i) {
          if (funkos[i]._id === id) {
            funkos[i] = funko;
            modified = true;
            break;
          }
        }
        if (!modified) {
          callback("ERROR: The ID does not exist", undefined);
          return;
        }
        fs.writeFile(filePath, JSON.stringify(funkos, null, 2), (errWrite) => {
          if (errWrite) {
            callback("Error writing file", undefined);
            return;
          }
          callback(undefined, "Modified Successfully :)");
        });
      });
    });
  });
}


/**
 * Method to view a funko from a file asynchronously using callbacks.
 * The function parameters remain as in the original; the funko details se muestran en consola.
 * @param user the user account
 * @param id the id of the funko to view
 */
export function viewOneFunkoFromFile(
  user: string,
  id: number, callback: (err: string | undefined, data: FunkoPop | undefined) => void
): void {
  const dirPath = `./users/${user}`;
  const filePath = path.join(dirPath, "funkos.json");
  let result: FunkoPop;

  fs.access(dirPath, fs.constants.F_OK, (errDir) => {
    if (errDir) {
      callback("ERROR: The path does not exist", undefined);
      return;
    }
    fs.access(filePath, fs.constants.F_OK, (errFile) => {
      if (errFile) {
        callback("ERROR: The file does not exist", undefined);
        return;
      }
      fs.readFile(filePath, "utf-8", (errRead, data) => {
        if (errRead) {
          callback("Error reading file:", undefined);
          return;
        }
        let funkos: FunkoPop[];
        try {
          funkos = JSON.parse(data);
        } catch (error: any) {
          callback("Error parsing JSON file", undefined);
          return;
        }
        let found = false;
        for (let i = 0; i < funkos.length; i++) {
          if (funkos[i]._id === id) {
            result = funkos[i]
            found = true;
            break;
          }
        }
        if (!found) {
          callback("COULD NOT READ, UNEXPECTED ERROR", undefined)
          return ;
        }
        callback(undefined, result);
        return
      });
    });
  });
}
