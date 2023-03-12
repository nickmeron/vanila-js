let url, reqmethod, reqheaders, reqbody;
let container = document.createElement("div");
container.className = "responses";


function createRow(col1, col2) {
    var table = "<table><tr><td>" + col1 + "</td><td>" + col2 + "</td></tr></table>";
    container.innerHTML += table;
    document.body.appendChild(container);
}

export class Leads {
    json;
    camapginId;
    token;
    organization;
    constructor(json, cmp, token, org) {
        this.json = json;
        this.camapginId = cmp;
        this.token = token;
        this.organization = org;
    }

    async createLeads() {
        this.json.forEach( async object => {
            if (this.organization == 'alvexo') {
                url = `https://trader.alvexo.com/web-api/v3/lead/register-aff?bn_cmp=${this.camapginId}&t_cre=${object.utmCreative}&nt_utmcontent=${object.utmContent}`;

                reqheaders = new Headers();
                reqheaders.append("Content-Type", "application/x-www-form-urlencoded");
                reqheaders.append("Authorization", "Bearer e5");
                reqheaders.append("Cookie", "brand=vpr; reg=2");

                reqbody = new URLSearchParams();
                reqbody.append("inputs[email]", object.email);
                reqbody.append("inputs[fullName]", object.name);
                reqbody.append("inputs[telephone]", object.mobile);
                reqbody.append("inputs[password]", "Temp1234");
                reqbody.append("inputs[demolive]", "2");
                reqbody.append("inputs[countryID]", object.country);
                reqbody.append("inputs[token]", this.token);
                reqbody.append("inputs[language]", object.language);
                reqbody.append("inputs[clientIP]", "85.16.12.12");
                reqbody.append("inputs[lpID]", "664");
                reqbody.append("inputs[clientUseragent]", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36");

                reqmethod = {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: reqheaders,
                    body: reqbody,
                    redirect: 'follow'
                };

               await fetch(url, reqmethod)
                .then((response) => response)
                .then((data) => {
                        createRow(object.email, "Completed");
                        uploadbtn.innerHTML = 'Upload Completed';
                        uploadbtn.style.backgroundColor = 'green';
                })

            } else if (this.organization == 'ogm' || this.organization == 'efinno') {

                let affHost = '';

                switch (this.organization) {
                    case 'ogm':
                        affHost = 'ogm.market';
                        break;
                    case 'efinno':
                        affHost = 'efinno.com';
                        break;
                    default:
                }


                url = `https://affiliates.${affHost}/lead/register-affiliate-lead?bn_cmp=${this.camapginId}&t_cre=${object.utmCreative}&nt_utmcontent=${object.utmContent}`

                reqheaders = new Headers();
                reqheaders.append("Authorization", "Bearer e5");
                reqheaders.append("Content-Type", "application/json");
                reqheaders.append("Cookie", "reg=7");

                reqbody = JSON.stringify({
                    "email": object.email,
                    "password": "Temp1234",
                    "telephone": object.mobile,
                    "fullName": object.name,
                    "countryID": object.country,
                    "clientIP": "93.11.230.38",
                    "clientUseragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                    "language": object.language,
                    "lpID": 100,
                    "demolive": 2,
                    "token": this.token,
                    "nt_company": this.organization
                });

                reqmethod = {
                    method: 'POST',
                    headers: reqheaders,
                    body: reqbody,
                    redirect: 'follow'
                };

               await fetch(url, reqmethod)
                .then((response) => response)
                .then((data) => {
                    if (data.ok) {
                        createRow(object.email, "Success");
                        uploadbtn.innerHTML = 'Leads Uploaded';
                        uploadbtn.style.backgroundColor = 'green';
                    } else {
                        createRow(object.email, "Failed: " + data.message);
                        uploadbtn.innerHTML = 'Completed';
                    }
                })
            }

        })
    }
}
