# Repo for DevOps with GitHub hands-on session

# Step 1 - Fork repo 

Fork this repo using the fork button on the top right of this page

# Step 2 - Create a new branch 

Click on branch and create a new branch called `automated-testing`

# Step 3 - Add Jest

Add Jest as dependency in your `package.json` and create a new test script. See lines 9 and 14 below (don't forget to add a comma "," in the line before):

<pre>
1  {
2   "name": "twilio-sko-devops-with-github",
3   "version": "0.0.0",
4   "private": true,
5   "scripts": {
6     "test": "echo \"Error: no test specified\" && exit 1",
7     "start": "twilio-run",
8     "deploy": "twilio-run deploy",
9     "jest": "jest"
10   },
11   "dependencies": {},
12   "devDependencies": {
13     "twilio-run": "^2.6.0",
14     "jest": "^26.5.2"
15   },
16   "engines": {
17     "node": "10"
18   }
19 }
</pre>

# Step 4 - Add a jest test script

Create a folder `__tests__` and create a file named `hello_world.test.js`. Copy the content from the file below: 

<details>
        <summary><b>Click here to view file contents to copy:</b></summary>
 
 ```javascript
 const Twilio = require('twilio');

describe('Test voice response TwiML', () => {
  beforeAll(() => {
    global.Twilio = Twilio;
  });

  it('returns "Hello World" TwiML response', (done) => {
    const tokenFunction = require('../functions/hello-world').handler;

    const callback = (err, twimlResponse) => {
      expect(twimlResponse.toString()).toBe(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Hello World!</Say></Response>'
      );
      done();
    };

    tokenFunction(null, {}, callback);
  });
});
```
 </details>
 
 # Step 5 - Add GitHub Action for testing
 
 Create a new folder `.github/workflows`. In this folder create a new file named `test.yml`. Past the content from the snippet below: 
 
 <details>
        <summary><b>Click here to view file contents to copy:</b></summary>
 
 ```yaml
 name: Twilio Serverless testing

on: [pull_request, push]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest]
        node-version: [10]

    steps:
      - name: Checkout code
        uses: actions/checkout@v1
      - name: Use Node.js version ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: npm install, build, and test
        run: |
          npm install
          npm run jest
        env:
          CI: true
 ```
 
 </details>
 
 After committing this file, open the action and see the test running. 
 
 # Step 6 - Add Secretes
 
 * In the repo click on Settings 
 * Click on "Secrets" in the lef side bar
 * Click on "New repository secret"
 * Add two secrets: 
   * `TWILIO_ACCOUNT_SID`
   * `TWILIO_AUTH_TOKEN`
 
 # Step 7 - Add script for deployment 
 
Add a file named `deploy.yaml` in the folder `.github/workflows`. Paste the content of the snippet below and commit: 
<details>
        <summary><b>Click here to view file contents to copy:</b></summary>

```yaml
name: Deployment to Twilio Serverless

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest]
        node-version: [10]

    steps:
      - name: Checkout code
        uses: actions/checkout@v1
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: npm install and deploy
        run: |
          npm install
          npm run deploy -- --account-sid ${{secrets.TWILIO_ACCOUNT_SID}} --auth-token ${{secrets.TWILIO_AUTH_TOKEN}} --override-existing-project
        env:
          CI: true

```
</details>
        
# Step 8 - Create a new deployment
        
* Switch to `main` branch 
* Click on "Compare & pull request"
* Wait for the test to be executed 
* Click on merge 

# Step 9 - Add Secrets for Twilio SMS 

Open the secret page in the repo settings and create the following secrets: 

* `TWILIO_ACCOUNT_SID`: this is your Twilio account SID or your API key
* `TWILIO_AUTH_TOKEN`: this is your Twilio auth token or your API secret
* `TWILIO_SMS_API_KEY`: this is an API to send SMS (create one at https://www.twilio.com/console/sms/project/api-keys)
* `TWILIO_SMS_SECRET_KEY`: this is the secret for the API key created above
* `TWILIO_SMS_FROM`: Phone number in your Twilio account to send the SMS from
* `TWILIO_SMS_TO`: Phone number to send the SMS to

# Step 10 - Add Twilio SMS notification 

Open the `.github/workflows/deploy.yaml` and add the content of the snippets below to the file: 
<details>
        <summary><b>Click here to view file contents to copy:</b></summary>
        
```yaml
  notify:
    runs-on: ubuntu-latest
    needs: deploy

    steps:
      - name: Send an SMS through Twilio
        uses: twilio-labs/actions-sms@v1
        with:
          fromPhoneNumber: ${{ secrets.TWILIO_SMS_FROM }}
          toPhoneNumber: ${{ secrets.TWILIO_SMS_TO }}
          message: '🚢 Deployment successful 🎉'
        env:
          TWILIO_ACCOUNT_SID: ${{ secrets.TWILIO_ACCOUNT_SID }}
          TWILIO_API_KEY: ${{ secrets.TWILIO_SMS_API_KEY }}
          TWILIO_API_SECRET: ${{ secrets.TWILIO_SMS_API_SECRET }}
```
</details>
