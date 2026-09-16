const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

let gold=100;

let soldiers=[];

let enemy={
    x:650,
    y:250,
    size:35,
    hp:100
};

function createSoldier(){

    if(gold<20){
        alert("Not enough gold!");
        return;
    }

    gold-=20;

    document.getElementById("gold").textContent=gold;

    soldiers.push({
        x:120+soldiers.length*35,
        y:250,
        size:20,
        hp:100
    });
}

function attack(){

    if(soldiers.length===0){
        alert("Create soldiers first!");
        return;
    }

    soldiers.forEach(soldier=>{

        enemy.hp-=10;

    });

    if(enemy.hp<=0){

        alert("🏆 Victory!");

        gold+=100;

        enemy.hp=100;

        soldiers=[];
    }
}

function update(){

    soldiers.forEach(soldier=>{

        if(soldier.x<550){

            soldier.x+=1;

        }

    });
}

function draw(){

    ctx.fillStyle="#35251c";
    ctx.fillRect(0,0,800,500);

    ctx.fillStyle="#555";
    ctx.fillRect(0,220,800,60);

    ctx.fillStyle="#286cff";

    soldiers.forEach(soldier=>{

        ctx.beginPath();

        ctx.arc(
            soldier.x,
            soldier.y,
            soldier.size,
            0,
            Math.PI*2
        );

        ctx.fill();
    });

    ctx.fillStyle="#ff3333";

    ctx.beginPath();

    ctx.arc(
        enemy.x,
        enemy.y,
        enemy.size,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle="white";

    ctx.font="18px Arial";

    ctx.fillText(
        "Enemy HP: "+enemy.hp,
        580,
        40
    );

    ctx.fillText(
        "Your Army",
        70,
        40
    );
}

function loop(){

    update();
    draw();

    requestAnimationFrame(loop);
}

document.getElementById("army").onclick=createSoldier;

document.getElementById("attack").onclick=attack;

loop();