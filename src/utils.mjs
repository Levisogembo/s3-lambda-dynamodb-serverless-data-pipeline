export function cleanETag(eTag) {
    if (!eTag) return 'unknown';
    return eTag.replace(/^"|"$/g, '');
}

export function getFileExtension(filename) {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}