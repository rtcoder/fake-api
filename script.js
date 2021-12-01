function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

document.querySelector('.links table').addEventListener('click', event => {
    const {target} = event;
    if (target.tagName.toLowerCase() !== 'button') {
        return;
    }

    const tr = target.closest('tr');
    const url = tr.querySelector('a').href;
    const codeBox = document.querySelector('.result code');
    document.querySelector('.result .url').innerText = url;
    codeBox.innerHTML = '';

    fetch(url).then(res => res.json())
        .then(arr => {
            if (arr.length > 500) {
                arr.length = 500;
            }
            codeBox.innerHTML = syntaxHighlight(JSON.stringify(arr, null, 4));
        });
});
