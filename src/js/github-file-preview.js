import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faX, faCopy, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-yaml';
import loadLanguages from 'prismjs/components/';

// Docusaurus renders highlighted code during SSR. Keep Prism from rewriting
// those blocks before React hydrates them. Previews call Prism.highlight()
// explicitly when loading a snippet
Prism.manual = true;
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
        popup.setAttribute('role', 'region');
        popup.setAttribute('aria-label', 'GitHub code preview');
        // Keep imperative UI outside React's hydrated Docusaurus root.
        document.body.appendChild(popup);
    }
    popup.classList.add('theme-code-block');

    let pointer = document.getElementById('gh-global-popup-pointer');
    if (!pointer) {
        pointer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pointer.id = 'gh-global-popup-pointer';
        pointer.setAttribute('aria-hidden', 'true');
        pointer.innerHTML = '<line></line><circle r="3"></circle>';
        document.body.appendChild(pointer);
    }

    let activeLink = null;
    let dismissTimeout = null;
    let hoverIntentTimeout = null; // 1-second delay before loading anything
    let popupWasDragged = false;

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

    function hidePopup(restoreFocus = false) {
        const triggerLink = activeLink;

        popup.classList.remove('gh-visible');
        pointer.classList.remove('gh-visible');
        popup.dataset.currentLinkHash = '';
        activeLink = null;

        if (restoreFocus) triggerLink?.focus();
    }

    function keepPreviewBelowNavbar() {
        const navbarBottom = document.querySelector('.navbar--fixed-top')?.getBoundingClientRect().bottom ?? 0;
        const hiddenPopupHeight = Math.max(0, navbarBottom - popup.getBoundingClientRect().top);
        popup.style.clipPath = hiddenPopupHeight ? `inset(${hiddenPopupHeight}px 0 0)` : '';
        pointer.style.clipPath = navbarBottom ? `inset(${navbarBottom}px 0 0)` : '';
    }

    function pointOnRect(rect, target) {
        const x = Math.min(Math.max(target.x, rect.left), rect.right);
        const y = Math.min(Math.max(target.y, rect.top), rect.bottom);
        if (target.x < rect.left || target.x > rect.right || target.y < rect.top || target.y > rect.bottom) {
            return { x, y };
        }

        const edges = [
            { x, y: rect.top },
            { x: rect.right, y },
            { x, y: rect.bottom },
            { x: rect.left, y }
        ];
        return edges.reduce((closest, point) => {
            const distance = Math.hypot(point.x - target.x, point.y - target.y);
            return distance < closest.distance ? { point, distance } : closest;
        }, { point: edges[0], distance: Infinity }).point;
    }

    function closestLinkPoint(linkRects, target) {
        return linkRects.reduce((closest, rect) => {
            const point = pointOnRect(rect, target);
            const distance = Math.hypot(point.x - target.x, point.y - target.y);
            return distance < closest.distance ? { point, distance } : closest;
        }, { point: target, distance: Infinity }).point;
    }

    function updateConnector(triggerLink) {
        const popupRect = popup.getBoundingClientRect();
        const popupCenter = {
            x: popupRect.left + popupRect.width / 2,
            y: popupRect.top + popupRect.height / 2
        };
        const linkRects = Array.from(triggerLink.getClientRects());
        if (!linkRects.length) linkRects.push(triggerLink.getBoundingClientRect());

        const overlapsLink = linkRects.some(rect => (
            rect.left < popupRect.right &&
            rect.right > popupRect.left &&
            rect.top < popupRect.bottom &&
            rect.bottom > popupRect.top
        ));
        if (overlapsLink) {
            pointer.classList.remove('gh-visible');
            return;
        }

        let linkPoint = closestLinkPoint(linkRects, popupCenter);
        let popupPoint = pointOnRect(popupRect, linkPoint);
        linkPoint = closestLinkPoint(linkRects, popupPoint);
        popupPoint = pointOnRect(popupRect, linkPoint);

        const line = pointer.querySelector('line');
        const dot = pointer.querySelector('circle');
        line.setAttribute('x1', linkPoint.x);
        line.setAttribute('y1', linkPoint.y);
        line.setAttribute('x2', popupPoint.x);
        line.setAttribute('y2', popupPoint.y);
        dot.setAttribute('cx', linkPoint.x);
        dot.setAttribute('cy', linkPoint.y);
        pointer.classList.add('gh-visible');
        keepPreviewBelowNavbar();
    }

    function enablePopupDragging(headerNode) {
        headerNode.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || event.target.closest('a, button')) return;

            event.preventDefault();
            cancelDismissal();
            popupWasDragged = true;

            const popupRect = popup.getBoundingClientRect();
            const pointerOffsetX = event.clientX - popupRect.left;
            const pointerOffsetY = event.clientY - popupRect.top;
            headerNode.classList.add('is-dragging');
            headerNode.setPointerCapture(event.pointerId);

            const movePopup = (moveEvent) => {
                const boundaryGap = 8;
                const navbarBottom = document.querySelector('.navbar--fixed-top')?.getBoundingClientRect().bottom ?? 0;
                const maximumLeft = Math.max(boundaryGap, document.documentElement.clientWidth - popupRect.width - boundaryGap);
                const maximumTop = Math.max(navbarBottom + boundaryGap, window.innerHeight - popupRect.height - boundaryGap);
                const popupLeft = Math.min(Math.max(moveEvent.clientX - pointerOffsetX, boundaryGap), maximumLeft);
                const popupTop = Math.min(Math.max(moveEvent.clientY - pointerOffsetY, navbarBottom + boundaryGap), maximumTop);

                popup.style.left = `${window.scrollX + popupLeft + popupRect.width / 2}px`;
                popup.style.top = `${window.scrollY + popupTop}px`;
                if (activeLink) updateConnector(activeLink);
            };

            const finishDragging = () => {
                headerNode.classList.remove('is-dragging');
                headerNode.removeEventListener('pointermove', movePopup);
                headerNode.removeEventListener('pointerup', finishDragging);
                headerNode.removeEventListener('pointercancel', finishDragging);
            };

            headerNode.addEventListener('pointermove', movePopup);
            headerNode.addEventListener('pointerup', finishDragging);
            headerNode.addEventListener('pointercancel', finishDragging);
        });
    }

    // Attach dismissal safeguards to the shared popup node
    popup.addEventListener('mouseenter', cancelDismissal);
    popup.addEventListener('mouseleave', startDismissalCountdown);
    window.addEventListener('scroll', () => {
        if (activeLink && popup.classList.contains('gh-visible')) updateConnector(activeLink);
    }, { passive: true });

    // Immediately remove the popup if any other part of the page is clicked
    document.addEventListener('click', (event) => {
        // If the click happened outside the popup AND outside the current triggering link
        if (!popup.contains(event.target) && !activeLink?.contains(event.target)) {
            hidePopup();
            if (hoverIntentTimeout) clearTimeout(hoverIntentTimeout);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('gh-visible')) hidePopup(true);
    });

    // Dynamic rendering engine leveraging Docusaurus's built-in Prism tokenization compiler
    function renderSnippet(filePath, contentData, lang, startLine, endLine, visibleStartLine, visibleEndLine) {
        popup.innerHTML = ''; // Clear loading strings safely

        const { parsedLines, originalLines, url } = contentData;
        const diff = endLine - startLine;
        const extraContextLines = diff < MAX_DANGLING_LINES ? Math.max(1, Math.ceil((MAX_DANGLING_LINES - diff) / 2)) : 0;
        const actualStartLine = visibleStartLine ?? Math.max(1, startLine - extraContextLines);
        const actualEndLine = visibleEndLine ?? Math.min(parsedLines.length, endLine + extraContextLines);
        const displayedLines = parsedLines.slice(
            actualStartLine - 1, // -1 because array index starts from 0, file lines start from 1
            actualEndLine
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
        const peekUpIcon = icon(faChevronUp).html.join('');
        const peekDownIcon = icon(faChevronDown).html.join('');
        const copyIcon = icon(faCopy).html.join('');
        const closeIcon = icon(faX).html.join('');
        const rightHeader = [
            '<div class="header__right">',
            `<a href="${url}" target="_blank" rel="noopener noreferrer" title="View on GitHub" class="github-redirect-btn">${ghIcon}<span>View on GitHub</span></a>`,
            `<button type="button" aria-label="Copy text to clipboard" title="Copy" class="clean-btn copy-btn">${copyIcon}</button>`,
            `<button type="button" aria-label="Close the popup menu" title="Close" class="clean-btn close-btn">${closeIcon}</button>`,
            '</div>'
        ].join('');

        const headerNode = document.createElement('div');
        headerNode.className = 'gh-popup-header';
        headerNode.innerHTML = leftHeader + rightHeader;
        popup.appendChild(headerNode);
        enablePopupDragging(headerNode);

        const closeBtn = headerNode.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => hidePopup(true));

        const copyBtn = headerNode.querySelector('.copy-btn');
        copyBtn.addEventListener('click', async () => {
            const copyLines = originalLines.slice(
                actualStartLine - 1,
                actualEndLine
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
        preNode.className = 'prism-code';
        const codeNode = document.createElement('code');
        codeNode.className = `language-${lang}`;

        const highlightedLines = displayedLines.map((line, index) => {
            const lineNo = actualStartLine + index;
            const isWithinBounds = lineNo >= startLine && lineNo <= endLine;
            const selectionClass = isWithinBounds ? " selected-line" : ""

            // We use arrays to avoid whitespace which would otherwise mess up the code lines.
            return [
                `<div class="gh-code-line${selectionClass}">`,
                `<span class="gh-line-number">${lineNo}</span>`,
                `<span class="gh-line-content">${line || ' '}</span>`,
                '</div>'
            ].join('');
        }).join('');

        codeNode.innerHTML = highlightedLines;

        const peekControls = document.createElement('div');
        peekControls.className = 'peek-controls';
        peekControls.innerHTML = [
            `<button type="button" aria-label="Show previous ${MAX_DANGLING_LINES} lines" title="Peek up" class="clean-btn peek-up-btn"${actualStartLine === 1 ? ' disabled' : ''}>${peekUpIcon}</button>`,
            `<button type="button" aria-label="Show next ${MAX_DANGLING_LINES} lines" title="Peek down" class="clean-btn peek-down-btn"${actualEndLine === parsedLines.length ? ' disabled' : ''}>${peekDownIcon}</button>`
        ].join('');

        peekControls.querySelector('.peek-up-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            renderSnippet(
                filePath,
                contentData,
                lang,
                startLine,
                endLine,
                Math.max(1, actualStartLine - MAX_DANGLING_LINES),
                actualEndLine
            );
            popup.querySelector('pre').scrollTop = 0;
            if (activeLink) repositionPopup(activeLink);
        });

        peekControls.querySelector('.peek-down-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            renderSnippet(
                filePath,
                contentData,
                lang,
                startLine,
                endLine,
                actualStartLine,
                Math.min(parsedLines.length, actualEndLine + MAX_DANGLING_LINES)
            );
            const codePreview = popup.querySelector('pre');
            codePreview.scrollTop = codePreview.scrollHeight;
            if (activeLink) repositionPopup(activeLink);
        });

        const bodyNode = document.createElement('div');
        bodyNode.className = 'gh-popup-body';
        preNode.appendChild(codeNode);
        bodyNode.append(preNode, peekControls);
        popup.appendChild(bodyNode);
    }

    function repositionPopup(triggerLink) {
        const linkRects = Array.from(triggerLink.getClientRects());
        const firstLinkRect = linkRects[0] ?? triggerLink.getBoundingClientRect();
        const lastLinkRect = linkRects.at(-1) ?? firstLinkRect;
        const boundaryGap = 8;
        const viewportLeft = boundaryGap;
        const viewportRight = document.documentElement.clientWidth - boundaryGap;
        const contentRect = triggerLink.closest('.theme-doc-markdown')?.getBoundingClientRect();
        const contentLeft = Math.max(viewportLeft, contentRect?.left ?? viewportLeft);
        const contentRight = Math.min(viewportRight, contentRect?.right ?? viewportRight);
        const contentWidth = contentRight - contentLeft;

        popup.style.removeProperty('max-width');
        const popupRect = popup.getBoundingClientRect();
        const useContentBounds = contentRect && contentWidth >= popupRect.width + boundaryGap * 2;

        const pointerLength = 48;
        const navbarBottom = document.querySelector('.navbar--fixed-top')?.getBoundingClientRect().bottom ?? 0;
        const topAboveLink = firstLinkRect.top - popupRect.height - pointerLength;
        const popupIsAboveLink = topAboveLink > navbarBottom;
        // Wrapped links have a separate rectangle for each rendered line.
        // Point to the fragment nearest the popup instead of the empty union center.
        const targetRect = popupIsAboveLink ? firstLinkRect : lastLinkRect;
        const linkCenter = targetRect.left + targetRect.width / 2;
        const halfPopupWidth = popupRect.width / 2;
        const minimumPopupCenter = (useContentBounds ? contentLeft : viewportLeft) + halfPopupWidth;
        const maximumPopupCenter = (useContentBounds ? contentRight : viewportRight) - halfPopupWidth;
        const popupCenter = Math.min(Math.max(linkCenter, minimumPopupCenter), maximumPopupCenter);

        activeLink = triggerLink;
        if (!popupWasDragged) {
            popup.style.left = `${window.scrollX + popupCenter}px`;
            popup.style.top = `${window.scrollY + (popupIsAboveLink
                ? targetRect.top - popupRect.height - pointerLength
                : targetRect.bottom + pointerLength)}px`;
        }
        updateConnector(triggerLink);
    }

    function attachPreviewToLink(link) {
        if (processedLinks.has(link)) return;
        if (popup.contains(link)) return; // GitHub <a> button.

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
        const loadingGitHubLink = `<a href="${urlString}" target="_blank" rel="noopener noreferrer" class="github-loading-link">View on GitHub</a>`;

        let parsedContent = cachedContent.get(cacheURL);

        window.addEventListener('resize', () => {
            if (
                activeLink &&
                popup.classList.contains('gh-visible')
            ) {
                repositionPopup(activeLink);
            }
        });

        const showPreview = () => {
            popup.dataset.currentLinkHash = link.hash;
            popup.classList.add('gh-visible');
            popupWasDragged = false;

            if (parsedContent) {
                renderSnippet(fileName, parsedContent, lang, startLine, endLine);
                repositionPopup(link);
            } else {
                popup.innerHTML = `<div class="loading"><span>Loading code preview...</span>${loadingGitHubLink}</div>`;
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

                        // Only update the popup if this link is still the active preview
                        if (activeLink === link && popup.classList.contains('gh-visible')) {
                            popup.classList.remove('loading');
                            renderSnippet(fileName, parsedContent, lang, startLine, endLine);
                            repositionPopup(link);
                        }
                    })
                    .catch(() => {
                        if (activeLink === link && popup.classList.contains('gh-visible')) {
                            popup.classList.remove('loading');
                            popup.innerHTML = `<div class="loading error"><span>Error loading snippet.</span>${loadingGitHubLink}</div>`;
                        }
                    });
            }
        };

        link.addEventListener('mouseenter', function () {
            cancelDismissal(); // Stop any pending 1-second close timers from other elements

            if (hoverIntentTimeout) clearTimeout(hoverIntentTimeout);

            // Wait for at least 1 second of constant hover time before performing actions
            hoverIntentTimeout = setTimeout(showPreview, 1000); // 1-second hover target buffer
        });

        // Handle MouseLeave (Cancel pending hover timers or start the 1-second close countdown)
        link.addEventListener('mouseleave', function () {
            if (hoverIntentTimeout) {
                clearTimeout(hoverIntentTimeout);
                hoverIntentTimeout = null;
            }
            startDismissalCountdown();
        });

        link.addEventListener('click', function (event) {
            const modifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
            if (event.defaultPrevented || modifiedClick) return;

            event.preventDefault();
            if (hoverIntentTimeout) clearTimeout(hoverIntentTimeout);

            if (activeLink === link && popup.classList.contains('gh-visible')) {
                hidePopup();
            } else {
                cancelDismissal();
                showPreview();
                if (event.detail === 0) {
                    popup.querySelector('.github-redirect-btn, .github-loading-link')?.focus();
                }
            }
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
