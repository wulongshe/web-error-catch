import jwt from 'jsonwebtoken';
import { upsertUser, type GiteeUserInfo } from '#src/database/index.ts';
import { syncAndGetRepos } from '#src/controller/repo.ts';

const GITEE_CLIENT_ID = process.env.GITEE_CLIENT_ID!;
const GITEE_CLIENT_SECRET = process.env.GITEE_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];

export function getGiteeAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: GITEE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user_info projects',
  });
  return `https://gitee.com/oauth/authorize?${params}`;
}

export async function handleGiteeCallback(code: string, redirectUri: string) {
  const tokenRes = await fetch('https://gitee.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: GITEE_CLIENT_ID,
      client_secret: GITEE_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Gitee token exchange failed: ${tokenRes.status}`);
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const userRes = await fetch(`https://gitee.com/api/v5/user?access_token=${access_token}`);
  if (!userRes.ok) {
    throw new Error(`Gitee user info fetch failed: ${userRes.status}`);
  }

  const giteeUser = (await userRes.json()) as GiteeUserInfo;
  const user = upsertUser(giteeUser, access_token);

  await syncAndGetRepos(user.id, access_token);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: {
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
    },
  };
}

export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
}
