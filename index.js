(function () {
  const formGroupEl = document.querySelector('.form-group');
  const inputEl = formGroupEl.querySelector('input');
  const buttonGroupEl = formGroupEl.querySelector('.button-group');

  const toastMessage = ToastMessage();

  buttonGroupEl.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    switch (e.target.className) {
      case 'button-level2':
        toastMessage.show(inputEl.value, 2);
        break;
      case 'button-level1':
        toastMessage.show(inputEl.value, 1);
        break;
      case 'button-level0':
        toastMessage.show(inputEl.value, 0);
        break;
      case 'button-delete-all':
        toastMessage.deleteAll();
        break;
      default:
        break;
    }
  });

  function ToastMessage() {
    let seqId = 0;

    const MAX_TOAST_NUM = 3;

    const levelToDelayMap = {
      2: 7000,
      1: 5000,
      0: 3000,
    };

    let toastList = [];

    const toastListEl = document.querySelector('.toast-list');
    toastListEl.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      const toastId = e.target.dataset['toastId'];
      const timerId = Number(e.target.dataset['timerId']);
      _delete(toastId, timerId);
    });

    const show = (message, level) => {
      if (!message) return;
      const toastId = `toast-${seqId++}`;

      const timerId = setTimeout(() => {
        _delete(toastId, timerId);
      }, levelToDelayMap[level]);

      const toastItemEl = document.createElement('li');
      toastItemEl.id = toastId;
      toastItemEl.className = `toast-item level${level}`;
      toastItemEl.innerHTML = `
        <div>${message}</div>
        <button data-toast-id="${toastId}" data-timer-id="${timerId}">X</button>
      `;

      toastListEl.appendChild(toastItemEl);

      toastList.push(toastItemEl);

      inputEl.value = '';

      if (toastList.length > MAX_TOAST_NUM) {
        toastItemEl.style.display = 'none';
      }
    };

    const _delete = (toastId, timerId) => {
      const targetEl = toastListEl.querySelector(`#${toastId}`);
      targetEl.remove();
      clearTimeout(timerId);
      toastList = toastList.filter((item) => item !== targetEl);
      toastList.forEach((item, i) => {
        if (i < 3) {
          item.style.display = '';
        }
      });
    };

    const deleteAll = () => {
      toastList.forEach((item) => {
        const deleteButtonEl = item.querySelector('button');
        const toastId = deleteButtonEl.dataset['toastId'];
        const timerId = Number(deleteButtonEl.dataset['timerId']);
        _delete(toastId, timerId);
      });
      toastList = [];
    };

    return {
      show,
      delete: _delete,
      deleteAll,
    };
  }
})();
