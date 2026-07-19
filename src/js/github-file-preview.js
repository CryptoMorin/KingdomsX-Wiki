import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faX, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-yaml';
import loadLanguages from 'prismjs/components/';
loadLanguages(['yaml']);

const languageAliases = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    yml: 'yaml',
    sh: 'bash',
    shell: 'bash',
    md: 'markdown'
};

const processedLinks = new WeakSet();
const cachedContent = new Map(); // { lang, parsedLines, originalLines, url }
const UNHOVER_TIMEOUT = 10 * 1000;
const MAX_DANGLING_LINES = 10; // If the target line is less that this, fill it with the surrounding lines.
const GITHUB_REGEX = /(?:https:\/\/)github\.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<hash>[a-f0-9]+)\/(?<filePath>.+\/(?<fileName>[^\/]+?\.(?<extension>[a-zA-Z0-9]+)))#L(?<lineStart>\d+)(?:-L(?<lineEnd>\d+))?/;

function setupGitHubPreviews() {
    // Ensure we create exactly ONE global popup instance for the entire page lifecycle
    let popup = document.getElementById('gh-global-persistent-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'gh-global-persistent-popup';
        // Keep imperative UI outside React's hydrated Docusaurus root.
        document.body.appendChild(popup);
    }

    let activeLink = null;
    let dismissTimeout = null;
    let hoverIntentTimeout = null; // 1-second delay before loading anything

    // Helper to stop the countdown if the mouse is inside a safe zone
    function cancelDismissal() {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
            dismissTimeout = null;
        }
    }

    // Starts the countdown to hide the popup
    function startDismissalCountdown() {
        cancelDismissal();
        dismissTimeout = setTimeout(hidePopup, UNHOVER_TIMEOUT);
    }

    function hidePopup() {
        popup.classList.remove('gh-visible');
        popup.dataset.currentLinkHash = '';
    }

    // Attach dismissal safeguards to the shared popup node
    popup.addEventListener('mouseenter', cancelDismissal);
    popup.addEventListener('mouseleave', startDismissalCountdown);

    // Immediately remove the popup if any other part of the page is clicked
    document.addEventListener('click', (event) => {
        // If the click happened outside the popup AND outside the current triggering link
        const currentHash = popup.dataset.currentLinkHash;
        const currentLink = currentHash ? document.querySelector(`a[href*="${currentHash}"]`) : null;

        if (!popup.contains(event.target) && event.target !== currentLink) {
            hidePopup();
            if (hoverIntentTimeout) clearTimeout(hoverIntentTimeout);
        }
    });

    // Dynamic rendering engine leveraging Docusaurus's built-in Prism tokenization compiler
    function renderSnippet(filePath, contentData, lang, startLine, endLine) {
        popup.innerHTML = ''; // Clear loading strings safely

        const { parsedLines, originalLines, url } = contentData;
        const diff = endLine - startLine;
        const extraContextLines = diff < MAX_DANGLING_LINES ? Math.max(1, Math.ceil((MAX_DANGLING_LINES - diff) / 2)) : 0;
        const actualStartLine = startLine - extraContextLines;
        const displayedLines = parsedLines.slice(
            Math.max(0, actualStartLine - 1), // -1 because array index starts from 0, file lines start from 1
            Math.min(parsedLines.length, endLine + extraContextLines)
        );

        // https://github.com/CryptoMorin/KingdomsX/blob/HASH/core/src/main/resources/config.yml
        //                                                   ^^^^^^^^^^^^^^^^^^^^^^^^
        //                                                             Remove
        const targetRemovalPath = 'src/main/resources/';
        const fileStartCutIndex = filePath.indexOf(targetRemovalPath);
        const normalizedFilePath = fileStartCutIndex > -1 ? filePath.substring(fileStartCutIndex + targetRemovalPath.length) : filePath;

        // 1. Create and Add the Header
        const leftHeader = '<div class="header__left">' + normalizedFilePath.split("/")
            .map(x => `<span class="file_path_component">${x}</span>`)
            .join(`<span class="file_path_separator">/</span>`) + '</div>';

        const ghIcon = icon(faGithub).html.join('');
        const copyIcon = icon(faCopy).html.join('');
        const closeIcon = icon(faX).html.join('');
        const rightHeader = [
            '<div class="header__right">',
            `<a href="${url}" target="_blank" rel="noopener noreferrer" alt="View on GitHub" class="github-redirect-btn">${ghIcon}</a>`,
            `<button type="button" aria-label="Copy text to clipboard" title="Copy" class="clean-btn">${copyIcon}</button>`,
            `<button type="button" aria-label="Close the popup menu" title="Close" class="close-btn">${closeIcon}</button>`,
            '</div>'
        ].join('');

        const headerNode = document.createElement('div');
        headerNode.className = 'gh-popup-header';
        headerNode.innerHTML = leftHeader + rightHeader;
        popup.appendChild(headerNode);

        const closeBtn = headerNode.querySelector('.close-btn');
        closeBtn.addEventListener('click', hidePopup);

        const copyBtn = headerNode.querySelector('.clean-btn');
        copyBtn.addEventListener('click', async () => {
            const copyLines = originalLines.slice(
                Math.max(0, actualStartLine - 1),
                Math.min(parsedLines.length, endLine + extraContextLines)
            );
            const copyText = copyLines.join('\n');
            try {
                await navigator.clipboard.writeText(copyText);
                console.log('Text successfully copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        // 2. Create the Code Containers
        const preNode = document.createElement('pre');
        const codeNode = document.createElement('code');
        codeNode.className = `language-${lang}`;

        const highlightedLines = displayedLines.map((line, index) => {
            const lineNo = actualStartLine + index;
            const isWithinBounds = lineNo >= startLine && lineNo <= endLine;
            const selectionClass = extraContextLines > 0 && isWithinBounds ? " selected-line" : ""

            // We use arrays to avoid whitespace which would otherwise mess up the code lines.
            return [
                `<div class="gh-code-line${selectionClass}">`,
                `<span class="gh-line-number">${lineNo}</span>`,
                `<span class="gh-line-content">${line || ' '}</span>`,
                '</div>'
            ].join('');
        }).join('');

        codeNode.innerHTML = highlightedLines;

        preNode.appendChild(codeNode);
        popup.appendChild(preNode);
    }

    function repositionPopup(triggerLink) {
        const rect = triggerLink.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        activeLink = triggerLink;
        popup.style.left =
            `${window.scrollX + rect.left + rect.width / 2}px`;

        popup.style.top =
            `${window.scrollY + rect.top - popupRect.height - 8}px`;
    }

    function attachPreviewToLink(link) {
        if (processedLinks.has(link)) return;

        // Verify URL validity
        const urlString = link.href;
        if (!urlString.includes('github.com') || !link.hash.startsWith('#L')) return;

        // Parse line coordinates
        const match = urlString.match(GITHUB_REGEX);
        if (!match) return;
        const groups = match.groups;

        const startLine = parseInt(groups['lineStart'], 10);
        const endLine = groups['lineEnd'] ? parseInt(groups['lineEnd'], 10) : startLine;

        // Mark as processed
        processedLinks.add(link);
        const fileName = groups['filePath'];

        // Deduce language type based on URL extension pathing
        const fileExtension = groups['extension'];
        let lang = fileExtension ? fileExtension.toLowerCase() : 'txt';
        lang = languageAliases[lang] || lang;

        // The necessary components to cache the entire file content.
        const cacheURL = ['user', 'repo', 'hash', 'filePath'].map(x => groups[x]).join('/');

        // Prepare the request URL
        const rawUrl = urlString
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/')
            .split('#')[0];

        let parsedContent = cachedContent.get(cacheURL);

        window.addEventListener('resize', () => {
            if (
                activeLink &&
                popup.classList.contains('gh-visible')
            ) {
                repositionPopup(activeLink);
            }
        });

        link.addEventListener('mouseenter', function () {
            if (popup.contains(link)) return; // GitHub <a> button.
            cancelDismissal(); // Stop any pending 1-second close timers from other elements

            if (hoverIntentTimeout) clearTimeout(hoverIntentTimeout);

            // Wait for at least 1 second of constant hover time before performing actions
            hoverIntentTimeout = setTimeout(() => {
                popup.dataset.currentLinkHash = link.hash;
                popup.classList.add('gh-visible');

                if (parsedContent) {
                    renderSnippet(fileName, parsedContent, lang, startLine, endLine);
                    repositionPopup(link);
                } else {
                    popup.innerHTML = '<div class="loading">Loading code preview...</div>';
                    popup.classList.add('loading');
                    repositionPopup(link); // Initial boundary layout calibration

                    // Fetch the content (lazy load, hits only once)
                    fetch(rawUrl)
                        .then(res => { if (!res.ok) throw new Error(); return res.text(); })
                        .then(text => {
                            const grammar = Prism.languages[lang] ?? Prism.languages.plain;
                            console.log("Prism grammar for", lang, ":", grammar);

                            const highlighted = Prism.highlight(
                                text,
                                grammar,
                                lang
                            );
                            parsedContent = {
                                lang,
                                parsedLines: highlighted.split(/\r?\n/),
                                originalLines: text.split(/\r?\n/),
                                url: urlString
                            };
                            cachedContent.set(cacheURL, parsedContent);

                            // Only process structural updates if the user is still actively hovering this target context
                            if (popup.dataset.currentLinkHash === link.hash && popup.classList.contains('gh-visible')) {
                                popup.classList.remove('loading');
                                renderSnippet(fileName, parsedContent, lang, startLine, endLine);
                                repositionPopup(link);
                            }
                        })
                        .catch(() => {
                            if (popup.dataset.currentLinkHash === link.hash && popup.classList.contains('gh-visible')) {
                                popup.classList.remove('loading');
                                popup.innerHTML = '<div class="loading error">Error loading snippet.</div>';
                            }
                        });
                }
            }, 1000); // 1-second hover target buffer
        });

        // Handle MouseLeave (Cancel pending hover timers or start the 1-second close countdown)
        link.addEventListener('mouseleave', function () {
            if (hoverIntentTimeout) {
                clearTimeout(hoverIntentTimeout);
                hoverIntentTimeout = null;
            }
            startDismissalCountdown();
        });
    }

    // Mutation Observer monitoring real-time tree mutations
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'A') {
                            attachPreviewToLink(node);
                        } else {
                            node.querySelectorAll('a').forEach(attachPreviewToLink);
                        }
                    }
                });
            }
        }
    });

    // Run an initial scan just in case some elements are already present
    document.querySelectorAll('a').forEach(attachPreviewToLink);

    // Start tracking changes globally across the entire page layout
    observer.observe(document.body, { childList: true, subtree: true });
}

if (ExecutionEnvironment.canUseDOM) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', setupGitHubPreviews, { once: true });
    } else {
        setupGitHubPreviews();
    }
}
