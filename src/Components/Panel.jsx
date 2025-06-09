import { Octokit } from '@octokit/core';
import {useEffect, useState} from 'react';

const Panel = ({...props}) => {

    // No, we don't post auth tokens in repo or in public.
    // Yes, this token is short-lived and scoped for minimal access & read-only.
    const octokit = new Octokit({
        auth: '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'
    })

    useEffect(() => {
        const fetchDirectoryData = async () => {
            const treeData = await octokit.request('GET /repos/jdboykinsii/amex-demo-gh-pages/git/trees/gh-pages', {
                owner: 'OWNER',
                repo: 'REPO',
                tree_sha: 'TREE_SHA',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })

            console.log(treeData);
        }
        fetchDirectoryData();
    })

    return <div><h1> Oh hello, Othello...</h1></div>
}

export default Panel;