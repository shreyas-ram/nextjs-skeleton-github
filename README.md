This is a [Next.js](https://nextjs.org/) project with an API exposed at `/api/github/webhooks` to listen to and interact with GitHub App webhooks

## Getting Started
* Setup a new GitHub App on your personal account: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app
* Create a new `.env.local` file and copy over the contents from `.env.example` 
* Update the fields with the items from the created GitHub App
* Run `npm run build` & `npm run start` to start the application
* You will need to forward the GitHub webhook events on to localhost. Eg: Smee using the command: `smee -u <YOUR_SMEE_URL> -t http://127.0.0.1:3000/api/github/webhooks`.  You might need to install smee cli for this
* Create an Issue on your configured GitHub repo to test it out

## Troubleshooting
If you have issues with Smee forwareding due to corporate VPNs i.e. you see and "Error unable to get local issuer certificate", most likely the issue is that node does not know the custom certificates for TLS validation. To fix this, check to see what the additinal root certs you need to notify node about. On MacOS, you shoud find these in your Keychain as <X Root CA Cert> or similar. 
1. Export all of them eg: Zscalar Root CA cert, X Corporate Root CA Cert from the Keychain as pem files
2. Create a new .pem file eg: node_extra_certs.pem and copy both the certificates into this file
3. Set the NODE_EXTRA_CA_CERTS to point to this file

`export NODE_EXTRA_CA_CERTS=<Full path to the new *.pem file>`

Source: https://stackoverflow.com/questions/36494336/npm-install-error-unable-to-get-local-issuer-certificate