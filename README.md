# SKO 2021: DevOps with GitHub Actions Workshop

This repo has been created using twilio CLI for serverless. The only thing added dependencies `jest` and the `jest` test script.

# Step 1 - Fork repo

Fork this repo using the fork button on the top right of this page

# Step 2 - Create a new branch

Click on branch and create a new branch called `actions`

# Step 3 - Add a jest test script

Navigate to the `__tests__` folder, and copy the contents from the below file into `hello_world.test.js`:

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


 # Step 4 - Add GitHub Action for testing

Navigate to the  `.github/workflows` folder. Copy the below content into the `test.yaml` file:

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
````

 </details>
 
  After you save the file and commit the change, you can navigate to the actions tab and view your test running. 
 
 # Step 5 - Add Secrets
 
 * In the repo, click on Settings 
 * Click on "Secrets" in the lef side bar
 * Click on "New repository secret"
 * Add the following two secrets corresponding to your Twilio account: 
   * `TWILIO_ACCOUNT_SID`
   * `TWILIO_AUTH_TOKEN`
 
# Step 6 - Add script for deployment 
 
In the folder `.github/workflows`, Paste the content of the snippet below into `deploy.yaml`, and commit the changes: 
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
        
# Step 7 - Create a new deployment
        
* Click on "Pull request"
* __Make sure you select your own main branch as the base__ (by default GitHub may attempt to create a pull request to the original repo you forked from)
* Wait for the test to be executed 
* Click on merge

If you go to the Actions tab, you will see the `test` and `deploy` workflow running in parallel

# Step 8 - Add Secrets for Twilio SMS

Open the secret page in the repo settings and create the following secrets:

- `TWILIO_ACCOUNT_SID`: this is your Twilio account SID or your API key
- `TWILIO_AUTH_TOKEN`: this is your Twilio auth token or your API secret
- `TWILIO_SMS_API_KEY`: this is an API to send SMS (create one at https://www.twilio.com/console/sms/project/api-keys)
- `TWILIO_SMS_API_SECRET`: this is the secret for the API key created above
- `TWILIO_SMS_FROM`: Phone number in your Twilio account to send the SMS from
- `TWILIO_SMS_TO`: Phone number to send the SMS to

# Step 9 - Add Twilio SMS notification

Open the `.github/workflows/deploy.yaml` file and add the content of the snippets below to the file (careful with the two blank spaces before `notify`):

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


Commit this to the `main` branch directly. After the deploy is executed, you should be recieve an sms message.