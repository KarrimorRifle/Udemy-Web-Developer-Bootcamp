let input = document.querySelector("#username");
let title = document.querySelector("h1")
input.addEventListener("input", e =>{
    title.innerText = input.value;
});