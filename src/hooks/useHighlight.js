import hljs from 'highlight.js';

export function useHighlight() {
    function highlight(el) {
        let codeBlocks = el.querySelectorAll('code');
        codeBlocks.forEach((codeBlock) => {
            hljs.highlightBlock(codeBlock);
        });
    }

    return {
        highlight,
    };
}
