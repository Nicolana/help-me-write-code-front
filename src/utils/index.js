
export const isEmpty = (item) => [null, undefined, ''].includes(item)

export const copyContent = (content) =>  {
    // 创建一个文本框元素
    const textArea = document.createElement("textarea");

    // 设置文本框的值（这里是你想要复制的文本）
    textArea.value = content;

    // 将文本框元素添加到DOM中
    document.body.appendChild(textArea);

    // 选择文本框中的文本
    textArea.select();

    try {
        // 尝试执行复制命令
        document.execCommand('copy');
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }

    // 最后，移除文本框元素
    document.body.removeChild(textArea);
}
