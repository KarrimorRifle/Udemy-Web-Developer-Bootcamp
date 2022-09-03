let player1 = document.querySelector(".player1");
let player2 = document.querySelector(".player2");
let btn1 = document.querySelector("#player1");
let btn2 = document.querySelector("#player2");
let reset = document.querySelector("#reset");
let playTo = document.querySelector("#playingTo");
var point1 = 0;
var point2 = 0;
btn1.addEventListener("click",function(){
    player1.textContent = ++point1;
    wintest();
});
btn2.addEventListener("click",function(){
    player2.textContent = ++point2;
    wintest();
});
reset.addEventListener("click",function(){
    [point1,point2,player1.textContent,player2.textContent] = [0,0,0,0]
    btn1.removeAttribute("disabled");
    btn2.removeAttribute("disabled");
    player1.style.color = "black";
    player2.style.color = "black";
})

let wintest = function(){
    let max = playTo.value;
    if(point1 == max || point2 == max){
        btn1.toggleAttribute("disabled");
        btn2.toggleAttribute("disabled");
        if(point1 > point2){
            player1.style.color = "green";
            player2.style.color = "red";
        }
        else{
            player1.style.color = "red";
            player2.style.color = "green";
        }
    }
}
