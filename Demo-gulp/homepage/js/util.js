function getURLParams () {
    const url = window.location.search; // 获取url中"?"符后的字串
    const theRequest = new Object();
    if (url.indexOf('?') !== -1) {
        const str = url.substr(1);
        const strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return theRequest;
};