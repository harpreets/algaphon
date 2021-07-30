//Fades LED strip based on command sent
#define WHITEPIN 9

#define BRIGHTA 20 //LOWEST BRIGHTNESS
#define BRIGHTB 64
#define BRIGHTC 128
#define BRIGHTD 200
#define BRIGHTE 255 //HIGHEST BRIGHTNESS
int currentBrightness = 0; //default off -- 0 brightness

//#define FADESPEED 20     // make this higher to slow down - UNCOMMENT for LED strip fade up/down test
 
void setup() {
  Serial.begin(9600);
  pinMode(WHITEPIN, OUTPUT);
}
 
 
void loop() {
  byte brightness;
  // check if data has been sent from the computer:

  if (Serial.available()) {
        // read the most recent byte (which will be from 0 to 255):
        brightness = Serial.read();
        if (brightness == 'a'){
          //lowest brightness
          currentBrightness = BRIGHTA;
         } else if (brightness == 'b'){
          currentBrightness = BRIGHTB;
         } else if (brightness == 'c'){
          currentBrightness = BRIGHTC;
         } else if (brightness == 'd'){
          currentBrightness = BRIGHTD;
         } else if (brightness == 'e'){
          //highest brightness
          currentBrightness = BRIGHTE;
         }
        
  }

  analogWrite(WHITEPIN, currentBrightness);

  delay(20);
  
//  int w;
// 
//  //from 0 to white
//  for (w = 0; w < 256; w++) { 
//    analogWrite(WHITEPIN, w);
//    delay(FADESPEED);
//  }
//
//  //from 0 to white
//  for (w = 255; w >=0; w--) { 
//    analogWrite(WHITEPIN, w);
//    delay(FADESPEED);
//  }
  
}
