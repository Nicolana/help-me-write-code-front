import hljs from 'highlight.js';

export const highlightDirective = {
    mounted(el) {
        let codeBlocks = el.querySelectorAll('code');
        codeBlocks.forEach((codeBlock) => {
            hljs.highlightBlock(codeBlock);
        });
        },
    updated(el) {
        let codeBlocks = el.querySelectorAll('code');
        codeBlocks.forEach((codeBlock) => {
            hljs.highlightBlock(codeBlock);
        });
        },
};
