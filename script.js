// ツールバーに便利アイコンを追加する
const addToolbarIcons = () => {
  const createElement = (html) => {
    const el = document.createElement('template');
    el.insertAdjacentHTML('beforeend', html);
    return el.firstElementChild;
  };

  const insert = (tag) => () => {
    const textarea = document.getElementById('_chatText');
    const cursor = textarea.selectionStart;
    textarea.setSelectionRange(cursor, cursor);
    textarea.focus();
    document.execCommand('insertText', false, tag);
  };

  const surround = (startTag, endTag) => () => {
    const textarea = document.getElementById('_chatText');
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const replaceText = `${startTag}${selectedText}${endTag}`;
    textarea.focus();
    document.execCommand('insertText', false, replaceText);
    if (selectedText.length == 0) {
      const cursor = textarea.selectionStart - endTag.length;
      textarea.setSelectionRange(cursor, cursor);
    }
  };

  const createIcon = (name, type, handler, desc) => {
    const html = `
<li class="_showDescription __chatworkInputTools_toolbarIcon" role="button" aria-label="${desc}" >
  <span class="__chatworkInputTools_toolbarIcon___chatworkInputTools_toolbarIcon_${type}">${name}</span>
</li>
    `.trim();
    const el = createElement(html);
    el.addEventListener('click', handler);
    return el;
  };

  const createIconWrapper = (icons) => {
    const html = '<ul id="__chatworkInputTools_toolbarIcons"></ul>';
    const el = createElement(html);
    const f = document.createDocumentFragment();
    for (const icon of icons) {
      f.appendChild(icon);
    }
    el.appendChild(f);
    return el;
  };


  let icons;
  icons = createIconWrapper([
    createIcon('info', 'tag', surround('[info]', '[/info]'), 'info: Surround selection with [info] tag'),
    createIcon('code', 'tag', surround('[code]', '[/code]'), 'code: Surround selection with [code] tag'),
  ]);


  const inject = () => {
    if (document.getElementById('__chatworkInputTools_toolbarIcons') == null) {
      const target = document.getElementById('_emoticon');
      if (target == null) {
        console.log('target element not found: _emoticon');
        return;
      }
      const parent = target.parentElement.parentElement.parentElement;
      const ref = target.parentElement.parentElement;
      if (parent != null && ref != null) {
        parent.insertBefore(icons, ref.nextSibling);
      }
    }
  };
  inject();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        inject();
      }
    }
  });

  const config = {
    childList: true,
  };

  observer.observe(document.getElementById('_chatSendArea'), config);
};

const ready = () => {
  const timeout = 10000;
  const delay = 100;
  const limit = timeout / delay;
  let count = 0;

  const find = (resolve, reject) => {
    if (count >= limit) {
      return reject(new Error('Timeline not found.'));
    }

    if (document.getElementById('_timeLine')) {
      return resolve();
    }

    count += 1;
    setTimeout(() => find(resolve, reject), delay);
  };

  return new Promise((resolve, reject) => find(resolve, reject));
};

ready()
  .then(() => {
    addToolbarIcons();
    enlargeMentionList();
  })
  .catch((err) => console.log(err));
