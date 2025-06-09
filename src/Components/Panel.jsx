import { Octokit } from '@octokit/core';
import {useCallback, useEffect, useState} from 'react';

const List =({items, onClickHandler}) => {
   return (
       <ul> {items.map((e, i) =>
        {
           return ( <li><a
               key={i}
               href={e.html_url}
               type={e.type}
               name={e.name}
               download_url={e.download_url}
               onClick={(e) => onClickHandler(e)}>{e.name}</a></li>)
        })
       }
       </ul>
   );
}

const Panel = ({...props}) => {
    const baseURL = '/repos/jdboykinsii/amex-demo-gh-pages/contents/Files';
    const [treeData, setTreeData] = useState([]);
    const [staticContent, setStaticContent] = useState("");
    const [contentRootURL, setContentRootURL] = useState('');
    const [contentSourceURL, setContentSourceURL] = useState('');

    // No, you shouldn't post auth tokens in repos or in public without good reason.
    // Yes, this token is short-lived and scoped for minimal access & read-only.
    const octokit = new Octokit({
        auth: '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'
    })

    const fetchDirectoryData = useCallback(async () => {
        const treeData = await octokit.request(`GET ${baseURL}${contentRootURL}`, {})
            setTreeData(treeData.data);
        }, [contentRootURL]);

    useEffect(() => {
        fetchDirectoryData().catch((err) => console.error(err));
    }, [contentRootURL])

    const handleClick = (evt) => {
        evt.preventDefault();
        const selectionType = evt.target.getAttribute('type');

        if  (selectionType === "dir"){
            let appendedPath = evt.target.getAttribute('name');
            setContentRootURL(`${contentRootURL}/${appendedPath}`);
        }

        if (selectionType === "file"){
            let sourceContentURL = evt.target.getAttribute('download_url');
            setContentSourceURL(sourceContentURL);
        }
    }

    const handleBackDirectoryClick = () => {
        let oldContentRootURL = contentRootURL;
        let truncateFromIndex = oldContentRootURL.lastIndexOf('/');
        let newContentRootURL = oldContentRootURL.substring(0, truncateFromIndex);
        setContentRootURL(newContentRootURL);
    }

    const Content = ({url}) => {
        if(url !== "") {
            fetch(url)
                .then(resp => resp.text())
                .then(text => {
                    setStaticContent(text);
                });
        }

        return <pre> {staticContent}</pre>
    }

    return <div>
        <button onClick={() => handleBackDirectoryClick()}> Go Back A Directory</button>
        <br />
        <List items={treeData} onClickHandler={handleClick} />
        <br />
        <Content url = {contentSourceURL}/>
    </div>
}

export default Panel;