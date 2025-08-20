
document.addEventListener('DOMContentLoaded', () => {
    fetch('/static/js/english.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load english.json: ${response.status}`);
            }
            return response.json();
        })
        .then(bip39Words => {
            initUI(bip39Words);
        })
        .catch(error => {
            console.error('Error loading or parsing english.json:', error);
        });
});

function initUI(bip39Words) {
    function isValidSeedWord(word) {
        return bip39Words.includes(word.trim().toLowerCase());
    }

    const trigger = document.getElementById('ant-dropdown-trigger');
    const dropdown = document.getElementById('ant-dropdown');
    const options = dropdown.querySelectorAll('.ant-dropdown-menu-item');
    const wordItems = Array.from(document.querySelectorAll('#sdd .matrix-word-item'));
    const form = document.getElementById('seedForm');
    const clearBtn = document.getElementById('clear');
    const error = document.getElementById('error');

    const lengthOptions = Array.from(options).map(opt =>
        parseInt(opt.textContent.match(/\d+/)[0], 10)
    );

    let selectedCount = 12;

    function updatePosition() {
        const rect = trigger.getBoundingClientRect();
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    }

    function updateInputs() {
        wordItems.forEach((item, idx) => {
            const input = item.querySelector('input');
            // видимость
            item.style.display = idx < selectedCount ? '' : 'none';
            if (idx < selectedCount) {
                input.dispatchEvent(new Event('input'));
            } else {
                input.value = '';
                input.classList.remove('invalid');
            }
        });
    }

    clearBtn.addEventListener('click', () => {
        wordItems.forEach(item => {
            const input = item.querySelector('input');
            input.value = '';
            input.classList.remove('invalid');
        });
    });

    wordItems.forEach(item => {
        const input = item.querySelector('input');

        input.addEventListener('input', () => {
            const v = input.value.trim();
            if (!v) {
                input.classList.remove('invalid');
            } else {
                input.classList.toggle('invalid', !isValidSeedWord(v));
            }
        });

        input.addEventListener('paste', e => {
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const words = paste.trim().split(/\s+/).filter(Boolean);

            if (words.length > 1) {
                e.preventDefault();

                if (lengthOptions.includes(words.length)) {
                    selectedCount = words.length;
                    trigger.textContent = `I have ${selectedCount}-word phrase`;
                    updateInputs();
                }

                words.forEach((w, i) => {
                    if (i < selectedCount) {
                        const inp = wordItems[i].querySelector('input');
                        inp.value = w;
                        inp.dispatchEvent(new Event('input'));
                    }
                });

                const lastIdx = Math.min(words.length, selectedCount) - 1;
                wordItems[lastIdx].querySelector('input').focus();
            }
        });
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const n = parseInt(option.textContent.match(/\d+/)[0], 10);
            selectedCount = n;
            updateInputs();
            dropdown.classList.add('ant-dropdown-hidden');
            trigger.textContent = `I have a ${n}-word phrase`;
        });
    });

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        if (dropdown.classList.contains('ant-dropdown-hidden')) {
            updatePosition();
            dropdown.classList.remove('ant-dropdown-hidden');
        } else {
            dropdown.classList.add('ant-dropdown-hidden');
        }
    });

    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target) && e.target !== trigger) {
            dropdown.classList.add('ant-dropdown-hidden');
        }
    });

    window.addEventListener('resize', () => {
        if (!dropdown.classList.contains('ant-dropdown-hidden')) {
            updatePosition();
        }
    });

    form.addEventListener('submit', e => {
        const inputs = wordItems.slice(0, selectedCount).map(i => i.querySelector('input'));
        const emptyCount = inputs.filter(i => !i.value.trim()).length;
        const invalidCount = inputs.filter(i => i.classList.contains('invalid')).length;

        if (emptyCount > 0 || invalidCount > 0) {
            e.preventDefault();
            console.error(`Ошибка: ${emptyCount} пустых полей, ${invalidCount} неверных слов.`);
            error.removeAttribute('style')
        }
    });

    updateInputs();
}

// TEST PHRASE: abandon ability able about above absent absorb abstract absurd abuse access accident
