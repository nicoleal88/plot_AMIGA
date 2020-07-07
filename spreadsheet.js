const { GoogleSpreadsheet } = require('google-spreadsheet');

// spreadsheet key is the long id in the sheets URL
//const doc = new GoogleSpreadsheet('1CBv7tgO901AIRwU08c702O4S-f-kP3eXiQwEjb-VqXU');

//await doc.useServiceAccountAuth(require('./client_secret.json'));

//await doc.loadInfo(); // loads document properties and worksheets

//console.log(doc.title);

async function accessSpreadsheet(){
	    const doc = new GoogleSpreadsheet('1CBv7tgO901AIRwU08c702O4S-f-kP3eXiQwEjb-VqXU');
	    await doc.useServiceAccountAuth(require('./client_secret.json'));
	    await doc.loadInfo();
	    console.log(doc.title);
	    const otherSheet = doc.sheetsByIndex[5];
	console.log(otherSheet);
}

accessSpreadsheet();

