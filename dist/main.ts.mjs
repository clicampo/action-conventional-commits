import { GitHub, context } from '@actions/github';
import * as core from '@actions/core';
import { getInput } from '@actions/core';
import get from 'lodash.get';

const DEFAULT_COMMIT_TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
  "merge",
  "wip"
];
const isValidCommitMessage = (message, availableTypes = DEFAULT_COMMIT_TYPES) => {
  if (message.startsWith("Merge ") || message.startsWith("Revert "))
    return true;
  let [possiblyValidCommitType] = message.split(":");
  possiblyValidCommitType = possiblyValidCommitType.toLowerCase();
  if (possiblyValidCommitType.match(/\(\S*?\)/))
    possiblyValidCommitType = possiblyValidCommitType.replace(/\(\S*?\)/, "");
  possiblyValidCommitType = possiblyValidCommitType.replace(/\s/g, "").replace(/()/g, "").replace(/[^a-z]/g, "");
  return availableTypes.includes(possiblyValidCommitType);
};

const extractCommits = async (context) => {
  const pushCommits = Array.isArray(get(context, "payload.commits"));
  if (pushCommits)
    return context.payload.commits;
  const prNumber = get(context, "payload.pull_request.number");
  if (prNumber) {
    try {
      const token = getInput("github-token");
      const github = new GitHub(token);
      const params = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber
      };
      const { data } = await github.pulls.listCommits(params);
      if (Array.isArray(data))
        return data.map((item) => item.commit);
      return [];
    } catch {
      return [];
    }
  }
  return [];
};

const extractPullRequest = async (context) => {
  const { payload } = context;
  const { pull_request: pullRequest } = payload;
  if (!pullRequest)
    throw new Error("No pull request found in the payload");
  const { title } = pullRequest;
  if (!title)
    throw new Error("No pull request title found in the payload");
  return title;
};

async function run() {
  if (core.getInput("check-pr-title") === "true") {
    const prTitle = await extractPullRequest(context);
    if (!isValidCommitMessage(prTitle))
      core.setFailed("\u{1F6A9} PR title is not valid");
    else
      core.info("\u2705 PR title is valid");
  }
  core.info("\u2139\uFE0F Checking if commit messages are following the Conventional Commits specification...");
  const extractedCommits = await extractCommits(context);
  if (extractedCommits.length === 0) {
    core.info("No commits to check, skipping...");
    return;
  }
  let hasErrors;
  core.startGroup("Commit messages:");
  for (let i = 0; i < extractedCommits.length; i++) {
    const commit = extractedCommits[i];
    if (isValidCommitMessage(commit.message)) {
      core.info(`\u2705 ${commit.message}`);
    } else {
      core.info(`\u{1F6A9} ${commit.message}`);
      hasErrors = true;
    }
  }
  core.endGroup();
  if (hasErrors) {
    core.setFailed("\u{1F6AB} According to the conventional-commits specification, some of the commit messages are not valid.");
  } else {
    core.info("\u{1F389} All commit messages are following the Conventional Commits specification.");
  }
}
run();
