//Zhifeng Lu
//CMPM 170 -spilt 1
//collective 506
//individual work


title = "Poop Poop Dog";

description = 

`
    Use poop to 
  slide them down, 
   don't get hurt
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

//"a" dog
`  
w w          
lwlww
wlwww
 rwwww 
  w w 
`,
//"b" dog--the other side
`
   w w         
 wwlwl
 wwwlw
wwwwr
 w w 
`,
//"c" poop
`
  y
 yyy
yyyyy
`,
//"d" bird
`
l    l
 l  l
  ll
`,
//"e" bird the other side
`

 l  l
l ll l
`,
//"f" man going left
`
  ll
  wl
 bbbl 
w bl w
  bl
 b l 
`,
//"g" man going right
`
  ll
  lw
 bbbl 
w bl w
  bl
  b l 
`
];

const G ={
  W: 100,             //Width of screen
  H: 100,             //Height of screen
  poop_cd: 100,       //cooldown between poop twice
  barW:40,            //Width of poopbar
  barH:2,              //Height of poopbar
  Bird_Sped: 1,        //speed of bird
  Poop_speed: 1 ,      
  bird_verticle_limit_value: 10,  
  human: 5,
  bird: 3,
  manNormalSpeedRange: 2,
}

//type player
  /**
  * @typedef{{
  * pos:Vector,
  * poopingcd: number
  * }} Player
  */
  /**
  * @type { Player }   //Single object
  */
  let player;
  
 //type poop
  /**
  * @typedef{{
  * pos:Vector
  * dir: number
  * }}Poop
  */
  /**
  * @type { Poop [] }  //Array of object Poop
  */
  let poop;

   //type bird
  /**
  * @typedef{{
  * pos:Vector
  * direction: number
  * verticle:number
  * limitUp:number
  * limitDown:number
  * gothit:boolean
  * gainPoint:boolean
  * }}Bird
  */
  /**
  * @type { Bird [] }  //Array of object Poop
  */
   let bird;

//type man
  /**
   * @typedef{{
   * pos: Vector
   * direction:number
   * hit:boolean
   * speed:number
   * rotation:number
   * gainPoint:boolean
   * }}Man
   */
  /**
   * @type { Man [] }
   */
  let man;

  /**
  * @type { number }
  */
  let waveCount;
    

  let isPressing;
  let moveAngle;
  let poopbar;
  let birdposX;
  let ManposX;
  let poopspeed = 0;
  let speed;

options = {
  isReplayEnabled: true,
  viewSize : { x: G.W, y: G.H },
  seed : 2,
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  isDrawingScoreFront: true,
  isPlayingBgm: true
  
};


function update() {
  


//updates
  if (!ticks) {
    waveCount = 0;
    player = {
      pos: vec(G.W * 0.5, G.H * 0.5),
      poopingcd: 0
    };
    moveAngle = 0;
    poop = [];
    bird = [];
    man = [];
    //UI
    poopbar = 0;
  }
  //scene painting
color("cyan");
rect(0,0,G.W,G.H/3);
color("light_black");
rect(0,G.H/3,G.W,G.H); 
color("yellow");
rect(G.W/2 -7.5 , -10, 15,15)


  if (bird.length === 0) {
    //direction and movement
     for (let i = 0; i < G.bird+floor(waveCount/10); i++) {
        const dir = rnd(0,100);
        if (dir < 50 ){ //spawn at right side of screen
          birdposX = G.W-5;
        }else{
          birdposX = 5;////spawn at left side of screen
        }
        const vert = rnd(0,100);
        
        const posY = rnd(5, G.H / 3 -5 );
        bird.push({ 
          pos: vec(birdposX, posY),
          direction: dir,
          verticle: vert,
          limitUp: posY+G.bird_verticle_limit_value,
          limitDown: posY-G.bird_verticle_limit_value,
          gothit : false,
          gainPoint:false,
        })
     }
  }
  if (man.length === 0) {
    // direction and movement
    for (let i = 0; i < G.human+floor(waveCount/5); i++) {
       const dir = rnd(0,100);
       if (dir < 50 ){
         ManposX = G.W-5;
       }else{
         ManposX = 5;
       }
       const posY = rnd(G.H /3 + 5,G. H-1 );
       man.push({ 
         pos: vec(ManposX, posY),
         direction: dir,
         hit:false,
         speed: 0,
         rotation:0,
         gainPoint:false
       })
    }
    waveCount++;
    
 }
  //player control code
  //set player position to the mouse position
  player.pos = vec(input.pos.x, input.pos.y);
  //limit player object in the game screen
  //    Vector.clamp(minX, maxX, minY, maxY)
  player.pos.clamp(0,G.W, G.H/3 , G.H - 2);
  player.poopingcd--;


  //poopbar that tells when player can poop
  color("black");
  //    const show= player.poopingcd / 10;
  //    text(show.toString(),G.W / 2 -10, 10 );       //Debug
  rect((G.W/2)-(G.barW/2),10,G.barW,G.barH);           //The background of bar
  color("green");                                     //The poopbar
  if (player.poopingcd >= 0){                         //limit the boundary of the bar
    poopbar = (G.poop_cd - player.poopingcd) * G.barW / G.poop_cd;      
  }else{ 
    poopbar = G.barW; 
  };
  rect((G.W/2)-(G.barW/2),10,poopbar,G.barH);   
        
  //when press, the dog poop
   if (input.isJustPressed && player.poopingcd <= 0) {
    play("laser");
    poop.push({
      pos:vec(player.pos.x, player.pos.y),
      dir: 0
    });
    player.poopingcd = G.poop_cd;
  }

  
  poop.forEach((pp) => {
    //drawing
    if (pp.dir>0){
      pp.pos.y-=G.Poop_speed ;
      if (pp.dir == 1){
        pp.pos.x -=G.Poop_speed;
      }else{
        pp.pos.x+=G.Poop_speed;
      }
    }
    color("yellow");
    char("c",pp.pos);
  });
  
  //bird functions
  remove(bird, (b) => {
    //flying direction
    if (b.gothit==false){
      if (b.direction > 50){
        b.pos.x += G.Bird_Sped;
      } else {
        b.pos.x -= G.Bird_Sped;
      };
      if (b.verticle > 50){
        b.pos.y -= G.Bird_Sped;
      }else{
        b.pos.y += G.Bird_Sped;
      };
      if (b.pos.y <= b.limitDown || b.pos.y > b.limitUp){
        b.verticle = 100-b.verticle;
      };
      if(b.pos.y >= G.H/3 -5 ){
        b.verticle += 50 ;
      };
      if(b.pos.y <= 5){
        b.verticle -= 50 ;
      };
    }else{
    //bird got hit by poop                   
      b.pos.y += G.Bird_Sped;   
    };

    //drawing bird
    color("black");
    const collide = 
    char(addWithCharCode("d", floor(ticks/30) % 2), b.pos, {
      mirror: { x: cos(moveAngle) < 0 ? -1 : 1 }
    }).isColliding.char.c;
    //got hit down
    if (collide){
      b.gothit= true;
      if (!b.gainPoint){
        play("powerUp")
        addScore(50,b.pos);
        b.gainPoint = true;
      }
    } 
    return (!b.pos.isInRect(0, 0, G.W, G.H/2 ));
  });

  //drawing player with animation
    color("black");
    char(addWithCharCode("a", floor(ticks/30) % 2), player.pos, {
      mirror: { x: cos(moveAngle) < 0 ? -1 : 1 }
    });

  //man functions
  remove(man, (m) => {
      if(!m.hit){
         m.speed = rnd(0,G.manNormalSpeedRange)
      }else{
        m.speed = 2;
        m.rotation-=3;
      }
      const speed=m.speed;
      if (m.direction<50){
        m.pos.x -=speed;
      }else {
        m.pos.x +=speed;
      }
       
      //drawing man
      color("black");
      if (m.direction < 50){    //man going left step on poop
        const collide = char("f",m.pos,{rotation:m.rotation}).isColliding.char;
         if (collide.c){
            m.hit = true;
            m.direction+=50;
            if (!m.gainPoint){
              play("coin")
              addScore(10,m.pos);
              m.gainPoint = true;
            }
        }
        if(collide.a||collide.b){
          end();
          play("lucky"); 
        }
      }else{                   //man going right step on poop
        // 
        const collide = char("g",m.pos,{rotation:m.rotation}).isColliding.char;
         if (collide.c){
            m.hit = true;
            m.direction-=50;
            if (!m.gainPoint){
              play("coin")
              addScore(10,m.pos);
              m.gainPoint = true;
            }
        }
        if(collide.a||collide.b){
           end();
           play("lucky"); 
         }
      }
    return (m.rotation<=-45 || !m.pos.isInRect(0, 0, G.W, G.H ));
  });

   // poop functions
   remove(poop,(pp) => {
    color("yellow");

    const collide =char("c",pp.pos).isColliding.char;
    if(collide.f){
      pp.dir=1;
    }
    if(collide.g){
      pp.dir=2;
    }
    return(!pp.pos.isInRect(0, 0, G.W, G.H ));
  });
  
}
