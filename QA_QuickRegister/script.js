const brandBtn = document.getElementsByClassName("btn");
const alvexoBtn = document.getElementById("alvexo");
const ogmBtn = document.getElementById("ogm");
const efinnoBtn = document.getElementById("efinno");
const langsList = document.getElementById("langs");
const methodList = document.getElementById("method");
const allOrgs = document.querySelectorAll(".btn");
const responseDiv = document.getElementById("responseDiv");
const loading = document.getElementById("loading");
const languages = document.getElementsByClassName("languages");
const AdditionalSteps = document.getElementsByClassName("smlBtn");
const actions = document.getElementsByClassName("actionBtn")
let phoneNumber = 0;
let accountGUID, TPnumber, TPguid;



function Params(org, lang, country, countrycode, method, cmp, token, url, host, affHost, phoneLength) {
    this.org = org;
    this.lang = lang;
    this.country = country;
    this.countrycode = countrycode;
    this.method = method;
    this.cmp = cmp;
    this.token = token;
    this.url = url;
    this.host = host;
    this.affHost = affHost;
    this.phoneLength = phoneLength;
}

let request = new Params;


for (let i = 0; i < brandBtn.length; i++) { //get org
    brandBtn[i].addEventListener('click', (element) => {
        document.getElementsByClassName("check")[0].style.visibility = "visible";
        let pickList = document.getElementById("langsDiv");
        pickList.style.display = "flex";
        let response = element.target.id;
        request.org = response;
        switch (response) { // remove irrelevant BU's
            case 'ogm':
                languages[4].remove()
                languages[1].remove()
                languages[1].remove()
                break;
            case 'efinno':
                languages[4].remove()
                languages[2].remove()
                break;
            case 'alvexo':
                languages[1].remove()
                languages[2].remove()
                break;
            default:
        }
        getCRMtoken(response);
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

langsList.addEventListener('change', (event) => { //get lang
    document.getElementsByClassName("check")[1].style.visibility = "visible";
    let pickList = document.getElementById("methodsDiv");
    pickList.style.display = "flex";
    let response = event.target.value;
    request.lang = response;
});

methodList.addEventListener('change', (event) => { //get method
    document.getElementsByClassName("check")[2].style.visibility = "visible";
    let response = event.target.value;
    request.method = response;
    buildReuquest(request);
    document.getElementsByClassName("instructions")[0].style.display = "none";
    loading.style.display = "flex";
});


function buildReuquest(obj) { //build request
    obj = request;
    switch (request.lang) { // set country info
        case 'en':
            request.country = "GB"
            request.countrycode = "44744"
            request.phoneLength = 7
            phoneNumber = generateRandomNumber(request.phoneLength);
            break;
        case 'fr':
            request.country = "FR"
            request.countrycode = "33744"
            request.phoneLength = 6
            phoneNumber = generateRandomNumber(request.phoneLength);
            break;
        case 'de':
            request.country = "DE"
            request.countrycode = "49744"
            request.phoneLength = 6
            phoneNumber = generateRandomNumber(request.phoneLength);
            break;
        case 'ar':
            request.country = "KW"
            request.countrycode = "965220"
            request.phoneLength = 5
            phoneNumber = generateRandomNumber(request.phoneLength);
            break;
        default:
            request.country = "GB"
            request.countrycode = "44744"
            request.phoneLength = 7
            phoneNumber = generateRandomNumber(request.phoneLength);
            break;
    }
    switch (request.org) { // set token and host settings
        case 'alvexo':
            request.cmp = '2758594'
            request.token = 'fwqass2rfa=2rNDYyOWFzY29pMW5iczIyZmVhc3ZlMzVlYXNkZmFsdmV4bw=='
            request.host = 'multi.alvexo.com'
            request.affHost = 'affiliates.alvexo.com'
            break;
        case 'ogm':
            request.cmp = '155'
            request.token = 'fwqass2rfa=2rMzFhc2NvaTFuYnMyMmZlYXN2ZTM1ZWFzZGZvZ20='
            request.host = 'multi.ogm.market'
            request.affHost = 'affiliates.ogm.market'
            break;
        case 'efinno':
            request.cmp = '163'
            request.token = 'fwqass2rfa=2rMzJhc2NvaTFuYnMyMmZlYXN2ZTM1ZWFzZGZlZmlubm8='
            request.host = 'multi.efinno.com'
            request.affHost = 'affiliates.efinno.com'
            break;
        default:
            errorInfo = `the token / the campaign is not cofigured for ${request.org} using ${request.method}`;
    }
    switch (request.method) { // set method
        case 'affiliation': // build affiliations request
            request.url = `https://${request.affHost}/lead/register-affiliate-lead?bn_cmp=${request.cmp}&t_cre=test&nt_utmcontent=test`;

            let AffHeaders = new Headers();
            AffHeaders.append("Authorization", "Bearer e5");
            AffHeaders.append("Content-Type", "application/json");
            AffHeaders.append("Cookie", "reg=7");

            let affRaw = JSON.stringify({
                "email": randomString + "@testbnology.com",
                "password": "Qa123123",
                "telephone": request.countrycode + phoneNumber,
                "fullName": "test QA",
                "countryID": request.country,
                "clientIP": "93.11.230.38",
                "clientUseragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                "language": request.lang,
                "lpID": 100,
                "demolive": 2,
                "token": request.token,
                "nt_company": request.org
            });
            document.getElementById("requestBox").innerHTML = affRaw;

            let affRequestOptions = {
                method: 'POST',
                headers: AffHeaders,
                body: affRaw,
                redirect: 'follow'
            };

            fetch(request.url, affRequestOptions) // show response to user
                .then(response => response.json())
                .then(result => {
                    accountGUID = result.AccountId;
                    document.getElementById("responseBox").innerHTML = JSON.stringify(result);
                    document.getElementById("userEmail").innerText = randomString + '@testbnology.com';
                    document.getElementById("userPassword").innerText = 'Qa123123';
                    loading.style.display = "none";
                    responseDiv.style.display = "flex";
                })
                .catch(error => {
                    document.getElementById("responseBox").innerHTML = error;
                    document.getElementById("status").innerHTML = "Failed to create"
                    document.getElementById("userEmail").style.display = "none";
                    document.getElementById("userPassword").style.display = "none";
                    responseDiv.style.backgroundColor = "#ba3535";
                    loading.style.display = "none";
                    responseDiv.style.display = "flex";
                });
            break;
        case 'organic': // build organic request
            request.url = `https://${request.host}/web-api/v3/lead/register`

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Authorization", "Bearer 6ff55031-aca2-449a-af68-e8c035141429");
            myHeaders.append("Cookie", "PHPSESSID=a84fe1c93b8b657983c523a8325b818f; reg=7");

            let urlencoded = new URLSearchParams();
            urlencoded.append("inputs[email]", randomString + "@testbnology.com");
            urlencoded.append("inputs[fullName]", "Test QA");
            urlencoded.append("inputs[telephone]", request.countrycode + phoneNumber);
            urlencoded.append("inputs[password]", "Qa123123");
            urlencoded.append("inputs[demolive]", "2");
            urlencoded.append("inputs[countryID]", request.country);
            urlencoded.append("inputs[language]", request.lang);
            document.getElementById("requestBox").innerHTML = urlencoded;

            let requestOptions = {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            fetch(request.url, requestOptions) // show response to user
                .then(response => response.text())
                .then(result => {
                    document.getElementById("responseBox").innerHTML = result;
                    document.getElementById("userEmail").innerText = randomString + '@testbnology.com';
                    document.getElementById("userPassword").innerText = 'Qa123123';
                    loading.style.display = "none";
                    responseDiv.style.display = "flex";
                })
                .catch(error => {
                    document.getElementById("responseBox").innerHTML = error;
                    document.getElementById("status").innerHTML = "Failed to create"
                    document.getElementById("userEmail").style.display = "none";
                    document.getElementById("userPassword").style.display = "none";
                    responseDiv.style.backgroundColor = "#ba3535";
                    loading.style.display = "none";
                    responseDiv.style.display = "flex";
                });
            break;
        default:
            alert('invalid method');
    }
    console.log(request);
}

// additional steps

for (let i = 0; i < AdditionalSteps.length; i++) { //create actions
    AdditionalSteps[i].addEventListener('click', (element) => {
        if (actions.length <= 1) {
            if (request.method=='organic'){
                createDepositbtn();
            }
            else if (request.method=='affiliation'){
            createTPbtn();
            createDepositbtn();
        }
        }
        for (let i = 0; i < actions.length; i++) { //get action
            actions[i].addEventListener('click', (element) => {
                let actionId = element.target.id;
                switch (actionId) {
                    case 'createTP':
                        if (request.method == 'organic') {
                            document.getElementById("createTP").innerHTML = `<h3 id="status">TP Created<img class="check" src="https://cdn-icons-png.flaticon.com/512/190/190411.png"></h3>`
                        } else if (request.method == 'affiliation')
                            document.getElementById("createTP").innerHTML = `Please Wait`
                            document.getElementById("createTP").style.backgroundColor = `orange`
                        createTP(request.org, accountGUID);
                        break;
                        case 'deposit':
                            document.getElementById("deposit").innerHTML = `Action Not Ready;)`
                            document.getElementById("deposit").style.backgroundColor = `orange`
                        break;
                    default:
                }
            })
        }
    })
};

//-----------get random email address & phone number-----------//
function getRandomLetter() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomString(length) {
    let str = '';
    for (let i = 0; i < length; i++) {
        str += getRandomLetter();
    }
    return str;
}
const randomString = getRandomString(25)

function generateRandomNumber(numOfDigits) {
    const maxNumber = Math.pow(10, numOfDigits) - 1;
    const minNumber = Math.pow(10, numOfDigits - 1);
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}

function createTPbtn() {
    let CreateTPbtn = document.createElement("div");
    CreateTPbtn.innerHTML = "<p>Create Tp</p>"
    CreateTPbtn.className = "actionBtn"
    CreateTPbtn.setAttribute("id", "createTP")
    responseDiv.appendChild(CreateTPbtn);
}

function createDepositbtn() {
    let CreateMTbtn = document.createElement("div");
    CreateMTbtn.innerHTML = "<p>Create Deposit</p>"
    CreateMTbtn.className = "actionBtn"
    CreateMTbtn.setAttribute("id", "deposit")
    responseDiv.appendChild(CreateMTbtn);
}


//-----------CREATE TP REQUEST-----------//
function createTP(organization, GUID) {
    GUID = accountGUID;
    let TransactionCurrencyId, nt_tradingplatformgroups, orgName;
    switch (organization) {
        case 'alvexo':
            TransactionCurrencyId = 'B7C99998-7A42-E411-9D38-000C29EF108C'
            orgName = 'Alvexoil'
            nt_tradingplatformgroups = '357307D0-8B4B-E711-80D7-0050568B4232'
            break;
        case 'ogm':
            TransactionCurrencyId = 'F1D38325-CAA2-EC11-80D1-0050560E1B8B'
            orgName = 'Ogm'
            nt_tradingplatformgroups = '28F92304-F563-ED11-80E1-0050560AC1BF'
            break;
        case 'efinno':
            TransactionCurrencyId = 'FB1D4002-2E6B-E411-95F4-000C29EF108C'
            orgName = 'Efinno'
            nt_tradingplatformgroups = 'EE4D9635-F863-ED11-80DA-0050560E1B8B'
            break;
        default:
    }

    let tpHeaders = new Headers();
    tpHeaders.append("Authorization", "Bearer " + CRMtoken);
    tpHeaders.append("Content-Type", "application/json");

    let tpBody = JSON.stringify({
        "nt_Accountid": accountGUID,
        "nt_demolive": 2,
        "TransactionCurrencyId": TransactionCurrencyId,
        "nt_tradingplatformgroups": nt_tradingplatformgroups,
        "AssetType": 2
    });

    let tpSettings = {
        method: 'POST',
        headers: tpHeaders,
        body: tpBody,
        redirect: 'follow'
    };

    fetch(`https://api-crm.tradingbnology.com/api/createtradingaccount?org=${orgName}`, tpSettings)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            TPnumber = result.nt_name;
            TPguid = result.nt_tpaccountId;
            document.getElementById("createTP").style.backgroundColor = "#0AA06E"
            document.getElementById("createTP").innerHTML = `<h3 id="status">TP Created<img class="check" src="https://cdn-icons-png.flaticon.com/512/190/190411.png"></h3>`;
        })
        .catch(error => {
            document.getElementById("createTP").style.backgroundColor = "#ba3535";
            document.getElementById("createTP").innerText = "Failed to create TP"
            console.log('error', error)
        });

}

//-----------CRM TOKEN REQUEST-----------//
let CRMtoken = '';

function getCRMtoken(brand) {
    let UserName, Password, grant_type, endPoint;

    switch (brand) {
        case 'alvexo':
            UserName = 'Web.Owner.al'
            Password = 'Ywz&nfCt9gx'
            grant_type = 'password'
            endPoint = 'https://api-crm.tradingbnology.com/api/token?org=Alvexoil'
            break;
        case 'ogm':
            UserName = 'web.owner.ogm'
            Password = '!SL8n94d!yPx'
            grant_type = 'password'
            endPoint = 'https://api-crm.tradingbnology.com/api/token?org=Ogm'
            break;
        case 'efinno':
            UserName = 'web.ow.ef'
            Password = '1@zIQLJc15(w'
            grant_type = 'password'
            endPoint = 'https://api-crm.tradingbnology.com/api/token?org=Efinno'
            break;
        default:
    }

    let reqHeaders = new Headers();
    reqHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let reqBody = new URLSearchParams();
    reqBody.append("UserName", UserName);
    reqBody.append("Password", Password);
    reqBody.append("grant_type", grant_type);

    let reqSettings = {
        method: 'POST',
        headers: reqHeaders,
        body: reqBody,
        redirect: 'follow'
    };

    fetch(endPoint, reqSettings)
        .then(response => response.json())
        .then(result => {
            CRMtoken = result.access_token;
            console.log('CRM token request success')
        })
        .catch(error => console.log('error', error));

}