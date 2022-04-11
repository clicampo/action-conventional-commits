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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPullRequest = void 0;
const extractPullRequest = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload } = context;
    const { pull_request: pullRequest } = payload;
    if (!pullRequest)
        throw new Error('No pull request found in the payload');
    const { title } = pullRequest;
    if (!title)
        throw new Error('No pull request title found in the payload');
    return title;
});
exports.extractPullRequest = extractPullRequest;
