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
