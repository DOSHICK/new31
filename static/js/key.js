/**
 * 
 * @param {string} val 
 * @returns {{ valid: boolean, isEth: boolean, isWif: boolean }}
 */

function validatePrivateKey(val) {
    const v = val.trim();

    const isEth = /^(0x)?[0-9a-fA-F]{64}$/.test(v);

    const isWif = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51,52}$/.test(v);

    return { valid: isEth || isWif, isEth, isWif };
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('key');
    const btn = document.getElementById('submitKey');
    const errorDiv = document.getElementById('error');
    const keyForm = document.getElementById('keyForm');

    keyForm.addEventListener('submit', e => {

        const { valid, isEth, isWif } = validatePrivateKey(input.value);

        if (!valid) {
            e.preventDefault();
            errorDiv.textContent = 'the private key is invalid';
            errorDiv.style.display = 'block';
            return;
        }

        errorDiv.style.display = 'none';

        if (isEth) {
            console.log('Ethereum');
            // keyForm.submit()
        } else if (isWif) {
            console.log('Bitcoin WIF');
            // keyForm.submit()
        }

    });

    input.addEventListener('input', () => {
        errorDiv.style.display = 'none';
    });
});
