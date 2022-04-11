"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
const isValidCommitMessage_1 = __importDefault(require("./isValidCommitMessage"));
const extractCommits_1 = __importDefault(require("./extractCommits"));
const extractPullRequest_1 = require("./extractPullRequest");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (core.getInput('check-pr-title') === 'true') {
            const prTitle = yield (0, extractPullRequest_1.extractPullRequest)(github_1.context);
            if (!(0, isValidCommitMessage_1.default)(prTitle))
                core.setFailed('🚩 PR title is not valid');
            else
                core.info('✅ PR title is valid');
        }
        core.info('ℹ️ Checking if commit messages are following the Conventional Commits specification...');
        const extractedCommits = yield (0, extractCommits_1.default)(github_1.context);
        if (extractedCommits.length === 0) {
            core.info('No commits to check, skipping...');
            return;
        }
        let hasErrors;
        core.startGroup('Commit messages:');
        for (let i = 0; i < extractedCommits.length; i++) {
            const commit = extractedCommits[i];
            if ((0, isValidCommitMessage_1.default)(commit.message)) {
                core.info(`✅ ${commit.message}`);
            }
            else {
                core.info(`🚩 ${commit.message}`);
                hasErrors = true;
            }
        }
        core.endGroup();
        if (hasErrors) {
            core.setFailed('🚫 According to the conventional-commits specification, some of the commit messages are not valid.');
        }
        else {
            core.info('🎉 All commit messages are following the Conventional Commits specification.');
        }
    });
}
run();
