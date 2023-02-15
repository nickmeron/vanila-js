
import {
    Leads
} from "./CreateLead.js";

const brandBtn = document.getElementsByClassName("btn");
const allOrgs = document.querySelectorAll(".btn");
const fileInput = document.getElementById('fileInput');
const uploadbtn = document.getElementById('uploadbtn');



let organization,camapginId,campaignToken;
let jsonData;



for (let i = 0; i < brandBtn.length; i++) { //get org
    brandBtn[i].addEventListener('click', (element) => {
        organization = element.target.id;
    });
}

for (const org of allOrgs) { // remove other orgs
    org.addEventListener('click', function () {
        for (const otherDiv of allOrgs) {
            if (otherDiv !== org) {
                otherDiv.style.display = 'none';
            }
        }
    });
}

function getCampaignId() { //get campaign id
    let campaignId = document.getElementById('campaignId').value;
    return campaignId;
}
function getCampaignToken() { //get campaign token
    let campaignToken = document.getElementById('token').value;
    return campaignToken;
}


fileInput.addEventListener('change', async (event) => { //reads the file and converts it to json
    const file = event.target.files[0];
    if (!file) return;
    uploadbtn.style.display = 'flex';

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = async (event) => {
        const csvData = event.target.result;
        const jsonData = await convertCsvToJson(csvData);
    };
});

async function convertCsvToJson(csvData) { // converts csv to json
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    camapginId = getCampaignId();
    campaignToken = getCampaignToken();

    jsonData = [];
    for (let i = 1; i < rows.length; i++) {
        const data = rows[i].split(',');
        const obj = {};
        for (let j = 0; j < data.length; j++) {
            obj[headers[j].trim()] = data[j].trim();
        }
        jsonData.push(obj);
    }
    jsonData = new Leads(jsonData,camapginId,campaignToken,organization); // creates a new instance of the Leads
    jsonData.json.pop();// removes the last line of excel - empty line
    console.log(jsonData);
}

uploadbtn.addEventListener('click', () => { // sends the json to the server

    if (organization == null || organization == undefined || camapginId == null || camapginId == undefined || campaignToken == null || campaignToken == undefined){
        alert("Please select an organization, campaign id and campaign token");
        return;
    }
    else{
    jsonData.createLeads();
    uploadbtn.innerHTML = 'Uploading...';
    }
});