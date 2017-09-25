#include <DHT.h>
#include <DHT_U.h>
#include "ESP8266WiFi.h"
#include <aREST.h>


// DHT11 sensor pins
#define DHTTYPE DHT11
#define DHTPIN D4 
 

DHT dht(DHTPIN, DHTTYPE);
int analogPin = A0;     
 int val =0 ;
// Create aREST instance
aREST rest = aREST();

// Initialize DHT sensor

// WiFi parameters
const char* ssid     = "fafa";
const char* password = "labfab35";

// The port to listen for incoming TCP connections 
#define LISTEN_PORT           80
#define ledPin 13
// Create an instance of the server
WiFiServer server(LISTEN_PORT);

// Variables to be exposed to the API
float temperature;
float humidity;

void setup(void)
{  
  // Start Serial
  Serial.begin(115200);
  
  // Init DHT 
  dht.begin();
  
  // Init variables and expose them to REST API
  rest.variable("temperature",&temperature);
  rest.variable("humidity",&humidity);
  rest.variable("vent",&val);
    
  // Give name and ID to device
  rest.set_id("1");
  rest.set_name("lamp_control");
    // Output pin
 pinMode(ledPin, OUTPUT);
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started");
  
  // Print the IP address
  Serial.println(WiFi.localIP());
  
}

void loop() {
   val = analogRead(analogPin);    // read the input pin

  Serial.println(val);             // debug value
  delay(1000) ;
   Serial.println(WiFi.localIP());
  // Reading temperature and humidity
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
   Serial.println(temperature);
   Serial.println(humidity);
  
  // Handle REST calls
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  while(!client.available()){
    delay(1);
  }
  rest.handle(client);
 
}
