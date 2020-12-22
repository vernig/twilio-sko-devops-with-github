# Repo for DevOps with GitHub hands-on session

# Step 1 - Fork repo 

Fork this repo using the fork button on the top right of this page

# Step 2 - Add Jest

<p style="color: red;">Add Jest as dependency</p> in your `package.json` file:

<details>
<summary><b>Click here to view the content of package.json</b></summary>
<pre>
 {
  "name": "twilio-sko-devops-with-github",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "twilio-run",
    "deploy": "twilio-run deploy",
<span style="color: red;">    "jest": "jest"</span>
  },
  "dependencies": {},
  "devDependencies": {
    "twilio-run": "^2.6.0",
    "jest": "^26.5.2"
  },
  "engines": {
    "node": "10"
  }
}
</pre>
</details>
