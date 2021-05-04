var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood,fedtime,lastfed;
var foodObj;

//create feed and lastFed variable here
var feed, lastfed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedthefood= createButton("Feed the Food");
  feedthefood.position(550,95);
  feedthefood.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
fedtime= database.ref('FeedTime');
fedtime.on("value", function(data){
  lastfed= data.val();
})
 
  //write code to display text lastFed time here

  textSize(21);
  fill("black");

  if(lastfed >= 12){
    //show time in AM 
   text("Last Feed : " + lastfed%12 +" PM", 150,30);
  } else if(lastfed == 0){
  text("Last Feed : 12AM",150,30);
  } else  {
  //show time in PM
  text("Last Feed : " + lastfed +" AM", 150,30);
  }

  
  
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  
  var food_stock_val= foodObj.getFoodStock();

  if(food_stock_val <= 0){
  foodObj.updateFoodStock(food_stock_val * 0);
  } else {
    foodObj.updateFoodStock(food_stock_val - 1);
  }

database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
}) 

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
