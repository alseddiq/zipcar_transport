function turn(vehicles,peoples,buildings){
   //documentation can be found in the source
   //Good luck :)
   addNeededParams(vehicles,peoples,buildings);
   
   calculateTime(peoples,buildings);
   
   for(var i=0;i<vehicles.length;i++)
   {
       var v = vehicles[i];
       if(!v.available)
       {
           if(arrived(v,v.destination))
           {
               //First drop off riders
               for(var j =  v.peoples.length - 1; j >= 0; j--) 
               {
                    if(v.peoples[j].destination == v.destination) {
                       v.peoples.splice(j, 1);
                    }
                }
                
               var riders = peopleAtBuilding(peoples, v.destination);
               for(var j=0;j < riders.length;j++)
               {
                   if(v.peoples.length < 4)
                   {
                       v.pick(riders[j]);                        
                   }

                  
               }    
               
               v.peoples.sort(function(a, b) {
                    return a.time - b.time;
                });
                
               if(v.peoples.length > 0)
               {
                  v.destination = destinationByName(buildings, v.peoples[0].destination);
                   
               }
               
               if(v.peoples.length == 0)
               {
                    v.available = true;
               }
               
           }
       }
   }
   
   for(var i=0;i<vehicles.length;i++)
   {
       var v = vehicles[i];
       if(!v.available)
       {
           v.moveTo(v.destination);
       }
   }

   var queue =  requestQueue(peoples, buildings);
   
   while(queue.length > 0)
   {
       console.log("dispatch to building " + buildings[i].name);
       var build = queue.shift();
       dispatch(vehicles, build);
   }
}

function peopleAtBuilding(peoples, building){
    var p = new Array();

    for(var i = 0;i < peoples.length;i++)
    {
        if(peoples[i].x == building.x && peoples[i].y == building.y && peoples[i].destination != building.name)
        {
            p.push(peoples[i]);
        }
    }
    
    var counter = {}
    p.forEach(function(ppl) {
       counter[ppl.destination] = (counter[ppl.destination] || 0) + 1;
    });
    
    p.sort(function(x, y) {
       var a = counter[y.destination] - counter[x.destination];
       if(a == 0)
       {
           a = x.time - y.time;
       }
       return a;
    });
    /*
    p.sort(function(a, b) {
        return a.time - b.time;
    });
    */
    
    return p;
}

function arrived(vehicles, building){
    var p = false;

    if(vehicles.x == building.x && vehicles.y == building.y)
    {
        p = true;
    }    
    return p;
}

function requestQueue(peoples, buildings){
    var peoplesCopy = peoples.slice();
    //Sort peoples by time
    peoplesCopy.sort(function(a, b) {
        return a.time - b.time;
    });
    
    var queue = [];
    

    for(var i = 0;i < peoplesCopy.length;i++)
    {
        for(var j=0;j < buildings.length;j++)
        {

            if(peoplesCopy[i].x == buildings[j].x && peoplesCopy[i].y == buildings[j].y)
            {
                //check if building already in queue
                if(queue.indexOf(buildings[j]) == -1)
                {
                    buildings[j].peoplesCount++;
                    queue.push(buildings[j]);
                }
                else 
                {
                    buildings[j].peoplesCount++;
                }
                j = buildings.length;
            }
        }
    }
    
    //Sort queue by highest number of peoples
    queue.sort(function(a, b) {
        return b.peoplesCount - a.peoplesCount;
    });
   
    return queue;
}

//Dispatch vehicle to building
function dispatch(vehicles, building){
    
    //Check if there is already vehicle going to this building
    for(var i = 0;i < vehicles.length;i++)
    {
        if(!vehicles[i].available && vehicles[i].destination == building)
        {
            return false;   
        }
    }
    
    var nearestV;
    var dist = 1000;
    
    for(var i = 0;i < vehicles.length;i++)
    {
        if(vehicles[i].available)
        {
            var d = distance(vehicles[i], building);
            if(d < dist)
            {
                dist = d;
                nearestV = vehicles[i];
            }
            
            
        }
    }
    
    if(dist < 1000)
    {
        nearestV.moveTo(building);
            
        nearestV.destination = building;
        nearestV.available = false;
        
        return true;
            
    }
    return false;
}

function destinationByName(destinations, name){
    
    var dest;
    
    for(var i = 0;i < destinations.length;i++)
    {
        if(destinations[i].name == name)
        {
            dest = destinations[i];
        }

    }
    
    return dest;
}

function addNeededParams(vehicles,peoples,buildings){
   for(var i=0;i<vehicles.length;i++)
   {
       var v = vehicles[i];
       if(typeof v.destination === 'undefined')
       {
            v["destination"] = null;    
       }
       
       if(typeof v.available === 'undefined')
       {
            v["available"] = true;    
       }
   }
   
   for(var i=0;i<peoples.length;i++)
   {
       var p = peoples[i];
       if(typeof p.timeToDestination === 'undefined')
       {
            p["timeToDestination"] = 0;    
       }
       
       if(typeof p.remainingTime === 'undefined')
       {
            p["remainingTime"] = 0;    
       }
   }
   
   
   for(var i=0;i<buildings.length;i++)
   {
       var b = buildings[i];
        b["peoplesCount"] = 0;    
   }
}

function calculateTime(peoples,buildings){
    
    for(var i=0;i < peoples.length;i++)
    {
        for(var j=0;j < buildings.length;j++)
        {
            if(peoples[i].destination == buildings[j].name)
            {
                peoples[i].timeToDestination = distance(peoples[i],buildings[j]) * 2 ;
                peoples[i].remainingTime = peoples[i].time - peoples[i].timeToDestination;
            }
        }
    }
}


function distance(a,b){
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}