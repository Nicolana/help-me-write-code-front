
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


// 实现一个函数，可以将上传文件的文件大小转成KB、MB、GB、TB、PB等等
export const formatFileSize = (size) => {
    if (size < 1024) {
        return `${size}B`;
    } else if (size >= 1024 && size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`;
    } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)}MB`;
    } else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    } else if (size >= 1024 * 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024 * 1024 * 1024)).toFixed(2)}TB`;
    } else if (size >= 1024 * 1024 * 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)}PB`;
    }
}
