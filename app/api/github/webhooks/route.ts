import { createOctokit } from '@/utils/octokit';
import { Webhooks } from '@octokit/webhooks';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

const webhook = new Webhooks({
    secret: process.env.WEBHOOK_SECRET!
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const data = JSON.stringify(body);
    const octokit = await createOctokit(body);
    const hdrs = headers();

	await webhook.verifyAndReceive({
		id: hdrs.get('x-github-delivery')!,
		name: hdrs.get('x-github-event') as any,
		signature: request.headers.get("x-hub-signature-256") as any,
		payload: data
	});

    webhook.on('issues.opened', ({ payload }) => {
        console.log("New issue created!");
        const { repository, issue } = payload;
        const { owner, repo, issue_number } = {
            owner: repository.owner.login,
            repo: repository.name,
            issue_number: issue?.number
        }
        octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body: "Thanks for opening this issue!"});
        });
    return new Response;
}

