const switchTheme = () => { 
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle("light-theme");
    htmlElement.classList.toggle("dark-theme");
}

document.getElementById("theme-switch").addEventListener("click", switchTheme);
