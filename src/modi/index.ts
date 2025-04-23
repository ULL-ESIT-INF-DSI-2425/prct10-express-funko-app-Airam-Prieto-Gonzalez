import request from "request";

/**
 * 
 * @param name 
 * @param type 
 * @param incantation 
 * @returns 
 */
export function findSpells(name: string = '', type: string = '', incantation: string = '') {
        return new Promise<request.Response>((resolve, reject) => {
                let url: string = "http://wizard-world-api.herokuapp.com/Spells"
                url += `?Name=${name}&Type=${type}&Incantation=${incantation}`
                // console.log(requestUrl)
                request({ url: url, json: true }, (error: Error, response) => {
                        if (error) {
                          reject(error);
                        }
                        else if (!response.body || response.body.length === 0) {
                                reject('No spells found matching the criteria.');
                        }
                        else {
                            resolve(response);
                        }
                });
        })

}

// console.log(await findSpells('Levitation Charm', 'Charm', 'Wingardium Leviosa'))
// console.log('\n\n=============================================================================\n\n')
// console.log(await findSpells('Charm'))
