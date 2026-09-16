const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

let distance=0;
let turbo=false;
let running=true;

const car={
    x:350,
    y:400,
    width:50,
    height:80,
    speed:5
};

let obstacles=[];

const keys={};

document.addEventListener("keydown",e=>{

    keys[e.key.toLowerCase()]=true;

    if(e.key===" "){
        turbo=true;
    }

});

document.addEventListener("keyup",e=>{

    keys[e.key.toLowerCase()]=false;

    if(e.key===" "){
        turbo=false;
    }

});

function createObstacle(){

    obstacles.push({

        x:100+Math.random()*500,

        y:-80,

        width:50,

        height:70,

        speed:4

    });
}

function update(){

    if(!running)return;

    if(keys["arrowleft"]||keys["a"]){
        car.x-=car.speed;
    }

    if(keys["arrowright"]||keys["d"]){
        car.x+=car.speed;
    }

    if(turbo){
        distance+=0.5;
    }

    distance+=0.1;

    document.getElementById("distance").textContent=
        Math.floor(distance);

    car.x=Math.max(80,Math.min(570,car.x));

    obstacles.forEach(obstacle=>{

        obstacle.y+=
            obstacle.speed+(turbo?3:0);

    });

    obstacles=obstacles.filter(obstacle=>{

        if(obstacle.y>500){
            return false;
        }

        return true;
    });

    obstacles.forEach(obstacle=>{

        if(

            car.x<obstacle.x+obstacle.width &&

            car.x+car.width>obstacle.x &&

            car.y<obstacle.y+obstacle.height &&

            car.y+car.height>obstacle.y

        ){

            running=false;

            alert(
                "🚘 CRASH!\nDistance: "+
                Math.floor(distance)+" m"
            );

        }

    });
}

function draw(){

    ctx.fillStyle="#292929";
    ctx.fillRect(0,0,700,500);

    ctx.fillStyle="#111";
    ctx.fillRect(70,0,560,500);

    ctx.strokeStyle="#fff";
    ctx.lineWidth=5;
    ctx.setLineDash([25,25]);

    ctx.beginPath();
    ctx.moveTo(350,0);
    ctx.lineTo(350,500);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle=turbo?"#00eaff":"#ff9900";

    ctx.fillRect(
        car.x,
        car.y,
        car.width,
        car.height
    );

    obstacles.forEach(obstacle=>{

        ctx.fillStyle="#ff3333";

        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

    });

    if(turbo){

        ctx.fillStyle="#00eaff";

        ctx.fillRect(
            car.x+15,
            car.y+car.height,
            20,
            30
        );
    }
}

function loop(){

    update();
    draw();

    requestAnimationFrame(loop);
}

function button(id,key){

    const btn=document.getElementById(id);

    btn.addEventListener("mousedown",()=>{
        keys[key]=true;
    });

    btn.addEventListener("mouseup",()=>{
        keys[key]=false;
    });

    btn.addEventListener("touchstart",e=>{
        e.preventDefault();
        keys[key]=true;
    });

    btn.addEventListener("touchend",()=>{
        keys[key]=false;
    });
}

button("left","arrowleft");
button("right","arrowright");

document.getElementById("turbo").addEventListener("mousedown",()=>{
    turbo=true;
});

document.getElementById("turbo").addEventListener("mouseup",()=>{
    turbo=false;
});

document.getElementById("turbo").addEventListener("touchstart",e=>{
    e.preventDefault();
    turbo=true;
});

document.getElementById("turbo").addEventListener("touchend",()=>{
    turbo=false;
});

setInterval(()=>{

    if(running){
        createObstacle();
    }

},900);

loop();