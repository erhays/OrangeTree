import { useEffect } from 'react';

const SCRIPT_SRC = 'https://link.clienticity.com/js/form_embed.js';

export function useClienticityScript() {
    useEffect(() => {
        if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        document.body.appendChild(script);
    }, []);
}
