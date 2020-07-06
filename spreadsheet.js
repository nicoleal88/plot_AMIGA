const GoogleSpreadsheet = require('google-spreadsheet');

const { promisify } = require('util');

const creds = require('client_secret.json');

async function accessSpreadsheet(){
    const doc = new GoogleSpreadsheet('1CBv7tgO901AIRwU08c702O4S-f-kP3eXiQwEjb-VqXU');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[5];
    console.log(`Title: ${sheet.title}, Rows: ${sheet.rowCount}`);

}

accessSpreadsheet();
