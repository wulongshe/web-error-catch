import { upsertRepos, getReposByUserId, type GiteeRepo } from '#src/database/index.ts';

export { getReposByUserId };

export async function syncAndGetRepos(userId: number, accessToken: string) {
  const repoList: GiteeRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://gitee.com/api/v5/user/repos?access_token=${accessToken}&page=${page}&per_page=${perPage}&sort=updated`,
    );
    if (!res.ok) {
      throw new Error(`Gitee repos fetch failed: ${res.status}`);
    }
    const batch = (await res.json()) as GiteeRepo[];
    repoList.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }

  upsertRepos(userId, repoList);
  return getReposByUserId(userId);
}
