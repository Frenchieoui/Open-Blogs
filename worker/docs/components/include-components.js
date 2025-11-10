const components = ["navbar"];
const folder = "/components/";
let componentsLoaded = 0;

components.forEach(async (name) => {
    class Component extends HTMLElement {
        async connectedCallback() {
            const html = await fetch(`${folder}${name}.html`).then(res => res.text());

            // Note: assigning innerHTML does not execute any <script> tags.
            this.innerHTML = html;

            // Find any scripts added by the HTML and recreate them so they execute.
            // Browsers won't run scripts added via innerHTML, so we replace each
            // <script> with a newly created one (or append external scripts to head).
            this.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');

                // Copy attributes (type, src, id, etc.)
                for (let i = 0; i < oldScript.attributes.length; i++) {
                    const attr = oldScript.attributes[i];
                    newScript.setAttribute(attr.name, attr.value);
                }

                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    document.head.appendChild(newScript);
                    oldScript.parentNode && oldScript.parentNode.removeChild(oldScript);
                } else {
                    newScript.textContent = oldScript.textContent;
                    oldScript.parentNode && oldScript.parentNode.replaceChild(newScript, oldScript);
                }
            });
        }
    }
    customElements.define("my-" + name, Component);
    componentsLoaded++;
    if (componentsLoaded === components.length) {
        if (document.body) {
            document.body.style.opacity = 1;
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.style.opacity = 1;
            });
        }
    }
});