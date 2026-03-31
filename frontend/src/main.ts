/* File: src/main.ts */
function initMobileMenu(): void {
    const nav = document.getElementById("site-nav");
    const hamburger = document.getElementById("hamburger");

    if (!(nav instanceof HTMLElement) || !(hamburger instanceof HTMLElement)) return;

    const toggleMobileMenu = (): void => {
        nav.classList.toggle("mobile");
        hamburger.setAttribute("aria-expanded", String(nav.classList.contains("mobile")));
    };

    hamburger.addEventListener("click", toggleMobileMenu);

    nav.addEventListener("click", (e: Event) => {
        const target = e.target;
        if (target instanceof HTMLAnchorElement && nav.classList.contains("mobile")) {
            nav.classList.remove("mobile");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });
}

function initYear(): void {
    const yearElement = document.getElementById("year");
    if (!(yearElement instanceof HTMLElement)) return;
    yearElement.textContent = `${new Date().getFullYear()} ©`;
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initYear();
});
