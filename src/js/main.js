document.addEventListener("DOMContentLoaded", myfunction);

function myfunction(){
    var menu = document.getElementById('menu');
    menu.addEventListener('click', function() {
        menu.classList.toggle("change");
    })
}
