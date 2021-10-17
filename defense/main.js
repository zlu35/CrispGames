//Zhifeng Lu & Jaedon Lee
//Partner project for spilt 1
//collective 506
//CMPM170

title = "tower defense";

description = `
  defense your tower
 until the last moment
`;

characters = [
// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.

//"a"--player character
` 
  GG  
  GlY
 ggg Y
 ggggY
  cc Y
 c cY
`,
//"b" aim
`
gg gg
g g g
 ggg
g g g
gg gg
`
];

const G ={
  W: 150,             //Width of screen
  H: 100,             //Height of screen
  tower_H: 40,        //Hight of tower
  tower_W:20,         //Width of tower
  init_speed:5,       //arrow speed
  init_Espeed:1,      //enemy movement speed
}

options = {
  theme:"dark",
  isReplayEnabled: true,
  viewSize : { x: G.W, y: G.H },
  isDrawingScoreFront: true,
};

//type aim
  /**
  * @typedef{{
  * pos:Vector,
  * }} Aim
  */
  /**
  * @type { Aim }   //Single object
  */
   let aim;

//type arrow
 /**
  * @typedef{{
  * pos: Vector,    //starting position
  * angle:number,
  * rotation:number,
  * }} Arrow
  */
 /**
  * @type { Arrow []}
  */let arrows;

//type Enemy
  /**
  * @typedef{{
  * pos:Vector,
  * }} Enemy
  */
  /**
  * @type { Enemy [] }  //Array objects
  */
   let enemies;

  /**
  * @type { number }
  */
   let waveCount;

   let dirX;        //Arrow direction
   let dirY         //Arrow direction
   let speed;
   let Espeed;
   let slope;
   let Y;
   let init_posX;    //arrow shooting position
   let init_posY;    //arrow shooting position

function update() {
  //scene
  //  moon
  color("black");
  box(G.W / 2 - 10, 8, 10 ,10 );
  //  tower
  color("light_black");
  rect(G.tower_W - 24, G.H - G.tower_H - 12 , 6             , 6);
  rect(G.tower_W - 12, G.H - G.tower_H - 12 , 6             , 6);
  rect(G.tower_W     , G.H - G.tower_H - 12 , 6             , 6);
  rect(0             , G.H - G.tower_H - 6  , G.tower_W + 6 , 6);
  rect(0             , G.H - G.tower_H      , G.tower_W     , G.tower_H);
  //  gate
  color("light_yellow");
  rect(G.tower_W / 2 , G.H - 30             , G.tower_W / 2 , 30);
  //  ground
  color("black");
  rect(0             , G.H - 15             , G.W           , G.H);
 //player character
  char("a"            ,G.tower_W + 4        , G.H - G.tower_H - 15  );
  


  if (!ticks) {
    aim = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
    };
    waveCount = 0;
    speed = G.init_speed;
    Espeed = G.init_Espeed;
    enemies = [];
    arrows = [];
    init_posX = G.tower_W + 6;
    init_posY = G.H - G.tower_H - 14;
  }

  //enemies spawn
  if (enemies.length === 0) {
    for (let i = 0; i < 5; i++) {
      enemies.push({
        pos: vec(G.W + i * 8 , G.H - 18),                                         //coordinate of where enemy spawn
      })
    }
    waveCount++;
  }

  //paint the aim
  aim.pos = vec(input.pos.x, input.pos.y);                                        //aim is where player's mouse at
  aim.pos.clamp(0, G.W, 0, G.H);                                                  //limit the aim, so it won't get outside
  color("black");                                             
  char("b",aim.pos);                                                              //drawing aim


  //shooting arrows
  if (input.isJustPressed) {

    arrows.push({                                                                 //shoot an arrow when clicked
      pos:vec(init_posX,init_posY),
      angle:vec(init_posX,init_posY).angleTo(aim.pos),                            //tracking to aiming position
      rotation:rnd(),                                             
    });

    //suicide if you shoot yourself
    if (22 <= aim.pos.x && aim.pos.x <=26 && 42 <=aim.pos.y && aim.pos.y<=47){    //player character's location
      end();
    }
  }

  arrows.forEach((ar) => {
      // arrow monvement
      ar.pos.x += speed * Math.cos(ar.angle);
      ar.pos.y += speed * Math.sin(ar.angle);
      color("yellow");
      box(ar.pos,1);
  });

  remove (enemies,(e) => {

   e.pos.x -= Espeed;                                        //enemy movement

   color("red");
   const collide = box(e.pos,6).isColliding;                 //enemy painting

   if (collide.rect.light_yellow){                           //collide with gate, game end
     end(); 
    }   
   return(collide.rect.yellow);                               //collide with arrow, enemy dies
  });

  remove(arrows,(ar) => {
    color("yellow");
    const collide =box(ar.pos,1).isColliding.rect.red;        //painting arrows
    if(collide){                                  
      addScore(10,ar.pos)                                     //if kill enemy, add score
    }
    return( collide ||!ar.pos.isInRect(0, 0, G.W, G.H ));    //destory the arrow if out of the scene || collide with enemy
  });
}
