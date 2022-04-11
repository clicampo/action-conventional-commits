"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
const github_1 = require("@actions/github");
const core_1 = require("@actions/core");
const extractCommits = (context) => __awaiter(void 0, void 0, void 0, function* () {
    // For "push" events, commits can be found in the "context.payload.commits".
    const pushCommits = Array.isArray((0, lodash_get_1.default)(context, 'payload.commits'));
    if (pushCommits)
        return context.payload.commits;
    // For PRs, we need to get a list of commits via the GH API:
    const prNumber = (0, lodash_get_1.default)(context, 'payload.pull_request.number');
    if (prNumber) {
        try {
            const token = (0, core_1.getInput)('github-token');
            const github = new github_1.GitHub(token);
            const params = {
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: prNumber,
            };
            const { data } = yield github.pulls.listCommits(params);
            if (Array.isArray(data))
                return data.map(item => item.commit);
            return [];
        }
        catch (_a) {
            return [];
        }
    }
    return [];
});
exports.default = extractCommits;
