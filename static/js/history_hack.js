document.addEventListener("DOMContentLoaded",()=>{
    const viewURL = "/chrome-extension://acmacodkjbdgmoleebolmdjonilkdbch"

    const orig = location.href

    history.replaceState(null, "", viewURL) // comment for develop

    window.addEventListener("popstate", (e)=>{
        history.replaceState(null,"", orig)
    })
    Array.from(document.querySelectorAll("a")).forEach((a)=>{
        a.addEventListener("click", (e)=>{
            e.preventDefault()
            history.replaceState(null,"", orig)
            window.location.href = e.target.closest("a").href
        })
    })
})