import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"
import crypto from "node:crypto";

export async function createOctokit(payload: any) {
  const appId = Number(process.env.APP_ID)
  const privateKey = process.env.PRIVATE_KEY!
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  // Private Key generated from GitHub is in PKCS1 format. However, this needs to be converted to PKCS#8 to be
  // supported by WebCrypto API. See: https://github.com/gr2m/universal-github-app-jwt?tab=readme-ov-file#about-private-key-formats
  const privateKeyPkcs8 = crypto.createPrivateKey(process.env.PRIVATE_KEY!).export({
    type: "pkcs8",
    format: "pem",
  });
  
  const auth = createAppAuth({
    appId,
    privateKey: privateKeyPkcs8 as string,
    clientId,
    clientSecret
  })

  const installationId = payload.installation.id

  // Authenticate as the GitHub App installation
  const { token } = await auth({ type: "installation", installationId })

  // Create a new Octokit instance with the authenticated token
  return new Octokit({ auth: token })
}