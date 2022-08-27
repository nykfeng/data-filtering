const fs = require("fs");
var xlsx = require("xlsx");

const usStatesAbb = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const dirName =
  "C:/Users/F-SFX/Desktop/Web Dev Learning/Projects/Projects for MediaRadar/Source Data/Source Data by State Names";

const cityNamePath =
  "C:/Users/F-SFX/Desktop/Web Dev Learning/Projects/Projects to post/Data Filtering/city-names";

const outputPath =
  "C:/Users/F-SFX/Desktop/Web Dev Learning/Projects/Projects to post/Data Filtering/result";

// Use fs.readFile() method to read the file
// fs.readFile("50States.txt", "utf8", function (err, data) {
//   // Display the file content
//   // console.log(data);
//   const states = data.split(", ");
//   // console.log(states.length);
// });

console.log("usStatesAbb");
console.log(usStatesAbb.length);

for (let i = 0; i < usStatesAbb.length; i++) {
  // read the state and city file
  let dataArray;

  const currentState = [];

  const someCityData = fs.readFileSync(
    cityNamePath + `/${usStatesAbb[i]} city names.csv`,
    "utf8"
  );
  dataArray = someCityData.split(/\r?\n/);

  for (let i = 1; i < dataArray.length; i++) {
    const city = dataArray[i].substring(0, dataArray[i].indexOf(","));
    const state = dataArray[i].substring(
      dataArray[i].indexOf(",") + 1,
      dataArray[i].length
    );
    currentState.push({ city, state });
  }

  // read the contacts file for the state
  const wb = xlsx.readFile(dirName + `/${usStatesAbb[i]}.xlsx`, {
    cellDates: true,
  });
  const wsh = wb.Sheets["sheet1"];
  const contactsData = xlsx.utils.sheet_to_json(wsh);
  const indexToRemove = [];

  for (let i = 1; i < contactsData.length; i++) {
    for (let j = 1; j < currentState.length; j++) {
      if (contactsData[i]["Contact Details City"] === currentState[j].city) {
        // console.log(
        //   "Contact Details City: " +
        //     contactsData[i]["Contact Details City"] +
        //     " , " +
        //     contactsData[i]["Contact Details State"]
        // );
        // console.log(
        //   "currentState[j].city: " +
        //     currentState[j].city +
        //     " , " +
        //     currentState[j].state
        // );

        indexToRemove.push(i);
      }
    }
  }

  // find not match data
  for (let i = 0; i < indexToRemove.length; i++) {
    // changing the array and its index here
    contactsData.splice(indexToRemove[i], 1);
    // so need to adjust the array index
    for (let j = i+1; j < indexToRemove.length; j++) {
      indexToRemove[j] -= 1;
    }
  }

  console.log(contactsData);

  // output the not match data by states
  const newWB = xlsx.utils.book_new();
  const newWS = xlsx.utils.json_to_sheet(contactsData);
  xlsx.utils.book_append_sheet(newWB, newWS, `${usStatesAbb[i]} City Data`);

  xlsx.writeFile(newWB, outputPath + `/${usStatesAbb[i]} - Potential Problematic City Data.xlsx`);
}

