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

const inputPath =
  "C:/Users/F-SFX/Desktop/Web Dev Learning/Projects/Projects to post/Data Filtering/result";

const outputPath =
  "C:/Users/F-SFX/Desktop/Web Dev Learning/Projects/Projects to post/Data Filtering/combined result";

const allData = [];

for (let i = 0; i < usStatesAbb.length; i++) {
  const inputFileName = `${usStatesAbb[i]} - Potential Problematic City Data.xlsx`;

  // read the contacts file for the state
  const wb = xlsx.readFile(inputPath + "/" +inputFileName, {
    cellDates: true,
  });
  const wsh = wb.Sheets[`${usStatesAbb[i]} City Data`];
  const oneStateData = xlsx.utils.sheet_to_json(wsh);


  // Now write data from each file to all data array
  for (let i = 1; i < oneStateData.length; i++) {
    allData.push(oneStateData[i]);
  }
  console.log(`Finished writing ${usStatesAbb[i]} data to all array`);

}

// output all state data
const newWB = xlsx.utils.book_new();
const newWS = xlsx.utils.json_to_sheet(allData);
xlsx.utils.book_append_sheet(newWB, newWS, `All State City Data`);

xlsx.writeFile(newWB, outputPath + `/All States Combined - Potential Problematic City Data.xlsx`);