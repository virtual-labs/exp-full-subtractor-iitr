var connections = [];

var deletecon=0;
 var jsPlumbInstance = null;
 
function BoardController() {
   
    var endPoints = [];

    this.setJsPlumbInstance = function (instance) {
        jsPlumbInstance = instance;
    };

    this.setCircuitContainer = function (drawingContainer) {
        jsPlumbInstance.Defaults.Container = drawingContainer;
    };

    this.initDefault = function () {

        jsPlumbInstance.importDefaults({
            Connector: ["Bezier", { curviness: 20 }],
            PaintStyle: { strokeStyle: 'blue', lineWidth: 3 },
            EndpointStyle: { radius: 4, fillStyle: 'blue' },
            HoverPaintStyle: { strokeStyle: "orange" },

          ConnectionsDetachable   : true

        });

        jsPlumbInstance.bind("beforeDrop", function (params) {
            var sourceEndPoint = params.connection.endpoints[0];
            var targetEndPoint = params.dropEndpoint;
            if (!targetEndPoint || !sourceEndPoint) {
                return false;
            }
            var sourceEndPointgroup = sourceEndPoint.getParameter('groupName');
            var targetEndPointgroup = targetEndPoint.getParameter('groupName');

            if (sourceEndPointgroup == targetEndPointgroup) {
                alert("Already connected internally");
                return false;
            } else {
                return true;
            }
        });

        jsPlumbInstance.bind("dblclick", function (conn) {
            jsPlumb.detach(conn);
            deletecon++;
            return false;
        });

        jsPlumbInstance.bind("jsPlumbConnection", function (conn) {
            var source = conn.connection.endpoints[0].getParameter('endPointName');
            connections[source] = conn.connection;

        });
    };

    this.addEndPoint = function (stroke,radius,maxConnection, divID, groupName, endPointName, anchorArray,color) {
        var endpointOptions = {
            isSource: true,
            isTarget: true,
            anchor: anchorArray,
            maxConnections: maxConnection,
            
            parameters: {
                "divID": divID,
                "endPointName": endPointName,
                "groupName": groupName,
                "type": 'output',
                "acceptType": 'input'
            },
            paintStyle: { radius: radius, fillStyle: color },
            connectorStyle:{strokeStyle:stroke, lineWidth:3}
        };

        jsPlumbInstance.addEndpoint(divID, endpointOptions);

        setEndpoint(endPointName, endpointOptions);
    };

    var setEndpoint = function (endPointName, endpointOptions) {
        endPoints[endPointName] = {
            "endPointName": endpointOptions.parameters.endPointName,
            "groupName": endpointOptions.parameters.groupName,
            "divID": endpointOptions.parameters.divID
        };

    };

    this.makeDraggable = function (selector) {
        jsPlumbInstance.draggable(selector, {

            stop: function () {

                var x = $(selector).position().left;
                jsPlumbInstance.repaint(selector);
            }
        });
    };


}



function draggable(item, container) {
    var dragItem = document.querySelector("#" + item);
    var container = document.querySelector("#" + container);

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === dragItem) {
            active = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e) {
        if (active) {

            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, dragItem);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
} 




  

function checkCircuit() {
   
    var g = new Graph(48);


  
    var groups = ['row2','row3','row4','row6','row7','row8','input_A', 'input_B','input_C','led_A','led_A1','led_C1', 'led_C', 'VCC', 'GND', 'ic74513_16', 'ic74513_15', 'ic74513_13', 'ic74513_12', 'ic74513_11', 'ic74513_10', 'ic74513_9', 'ic74513_8', 'ic74513_7', 'ic74513_6', 'ic74513_5', 'ic74513_4', 'ic74513_3', 'ic74513_2',  'ic74513_14', 'ic74513_1',  'ic7404_VCC', 'ic7404_4A', 'ic7404_4B', 'ic7404_4Y', 'ic7404_3A', 'ic7404_3B', 'ic7404_3Y', 'ic7404_1A', 'ic7404_1B', 'ic7404_1Y', 'ic7404_2A', 'ic7404_2B', 'ic7404_2Y', 'ic7404_GND', 'row1',   'row5']
    
    console.log(groups.length)
    for (var i = 0; i < groups.length; i++) { //inserting groups vertexes
        g.addVertex(groups[i]);
    }

    for (key in connections) {  // adding edges
        g.addEdge(connections[key].endpoints[0].getParameter('groupName'), connections[key].endpoints[1].getParameter('groupName'));
    }
   console.log("###noofedges->"+(g.numberofedges-deletecon));
   


    if(g.isConnected("ic74513_16","VCC")&& g.isConnected("ic74513_1",'GND')){
   
        console.log("IC74513 connected to supply");
        if(g.isConnected("ic7404_VCC","VCC")&& g.isConnected("ic7404_GND","GND")){
          
            console.log("IC7404 connected to supply")
            if(g.isConnected("led_C","GND")){
                
                console.log("LED connected to ground")
                if(g.isConnected("led_C1","GND")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("led_A1","ic74513_9")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("led_A","ic74513_7")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_A","ic74513_14")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_B","ic74513_2")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("VCC","ic74513_11")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("GND","ic74513_8")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("GND","ic74513_12")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("GND","ic74513_15")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_C","ic74513_3")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_C","ic74513_10")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_C","ic74513_13")){
                    
                console.log("LED connected to ground")
                 if(g.isConnected("input_C","ic74513_6")){
                    
                console.log("LED connected to ground")


                if(g.isConnected("input_C","ic7404_1A")&&g.isConnected("ic7404_1B","ic74513_4")&&g.isConnected("ic74513_5","ic7404_1B")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
            }else if(g.isConnected("input_C","ic7404_1Y")&&g.isConnected("ic7404_2A","ic74513_4")&&g.isConnected("ic74513_5","ic7404_2A")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
            }else if(g.isConnected("input_C","ic7404_2B")&&g.isConnected("ic7404_2Y","ic74513_4")&&g.isConnected("ic74513_5","ic7404_2Y")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
            }else if(g.isConnected("input_C","ic7404_3B")&&g.isConnected("ic7404_3Y","ic74513_4")&&g.isConnected("ic74513_5","ic7404_3Y")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
            }else if(g.isConnected("input_C","ic7404_4Y")&&g.isConnected("ic7404_3A","ic74513_4")&&g.isConnected("ic74513_5","ic7404_3A")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
            }else if(g.isConnected("input_C","ic7404_4A")&&g.isConnected("ic7404_4B","ic74513_4")&&g.isConnected("ic74513_5","ic7404_4B")){alert("Right connections. Now click on Start Simulation Button.");document.getElementById("startbutton").disabled=false;document.getElementById("resetbutton").disabled=false;document.getElementById("checkbutton").disabled=true;
           
            }

           
            else 
            {
                alert("Wrong Connections.");
                document.getElementById("resetbutton").disabled=false;
                document.getElementById("startbutton").disabled=true;
            } 
            }else{
                document.getElementById("resetbutton").disabled=false;
                alert("Connect Pin-6 of IC-74153 properly.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Connect to Pin-13 of IC-74153 properly.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Connect  Pin-10 of IC-74153 properly.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Connect  Pin-3 of IC-74153 properly.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Pin-13 of IC-74153 not connected to GND.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Pin-12 of IC-74153 not connected to GND.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Pin-8 of IC-74153 not connected to GND.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Pin-11 of IC-74153 not connected to VCC.")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" B not connected to Pin-2 of IC-74153 .")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert("A not connected to Pin-14 of IC-74153 .")
            } 
             }else{document.getElementById("resetbutton").disabled=false;
                alert(" D not connected to Pin-7 of IC-74153 .")
            } 
             }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Bout not connected to Pin-9 of IC-74153 .")
            } 
            }else{
                document.getElementById("resetbutton").disabled=false;
                alert(" Bout not connected to GND.")
            }

            }else{
                document.getElementById("resetbutton").disabled=false;
                alert("D not connected to GND.")
            }
        }else{
            document.getElementById("resetbutton").disabled=false;
            alert("IC-7404 not connected to supply.")
      }
    }else{
        document.getElementById("resetbutton").disabled=false;
        alert("IC-74153 not connected to supply.");
    }


console.log("executed")
}






























