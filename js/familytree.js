import { supabase } from "../database.js";

import { openProfile } from "./profiles.js";

import cytoscape from
"https://cdn.jsdelivr.net/npm/cytoscape/+esm";



async function loadTree(){


const tree = document.getElementById("tree");


if(!tree){

    return;

}



// Get people

const {data:people,error:peopleError}=await supabase

.from("people")

.select("*");



// Get marriages

const {data:marriages,error:marriageError}=await supabase

.from("marriages")

.select("*");



// Get marriage children

const {data:marriageChildren,error:childrenError}=await supabase

.from("marriage_children")

.select("*");





if(peopleError){

console.log("People error:", peopleError);

return;

}


if(marriageError){

console.log("Marriage error:", marriageError);

return;

}


if(childrenError){

console.log("Marriage children error:", childrenError);

return;

}





console.log("People:", people);

console.log("Marriages:", marriages);

console.log("Marriage Children:", marriageChildren);





let nodes = [];

let edges = [];





// Create person nodes

people.forEach(person=>{


nodes.push({

data:{

id:`person-${person.id}`,

label:
`${person.first_name || ""} ${person.last_name || ""}`,

type:"person",

person:person

}

});


});







// Create marriage nodes

marriages.forEach(marriage=>{


const marriageID =
`marriage-${marriage.id}`;



nodes.push({

data:{

id:marriageID,

label:"💍",

type:"marriage"

}

});





edges.push({

data:{

id:`spouse-${marriage.id}-1`,

source:`person-${marriage.spouse_one}`,

target:marriageID,

type:"spouse"

}

});





edges.push({

data:{

id:`spouse-${marriage.id}-2`,

source:`person-${marriage.spouse_two}`,

target:marriageID,

type:"spouse"

}

});



});






// Connect children to marriages

marriageChildren.forEach(connection=>{


edges.push({

data:{

id:

`child-${connection.marriage_id}-${connection.child_id}`,

source:

`marriage-${connection.marriage_id}`,

target:

`person-${connection.child_id}`,

type:"child"

}

});


});







const cy = cytoscape({


container:tree,



elements:{

nodes:nodes,

edges:edges

},




style:[


{

selector:'node[type="person"]',

style:{

label:"data(label)",

"background-color":"#2e8b57",

color:"white",

width:120,

height:120,

"text-valign":"center",

"text-halign":"center"

}

},




{

selector:'node[type="marriage"]',

style:{

label:"data(label)",

"background-color":"#e91e63",

color:"white",

width:50,

height:50,

"text-valign":"center",

"text-halign":"center"

}

},




{

selector:"edge",

style:{

width:3,

"line-color":"#555"

}

}



],




layout:{

name:"breadthfirst",

directed:true,

spacingFactor:3,

padding:100

}



});







// Click profiles

cy.on(

"tap",

"node[type='person']",

function(){

openProfile(

this.data("person")

);

}

);





// Controls

window.zoomIn=()=>{

cy.zoom(cy.zoom()+0.2);

};


window.zoomOut=()=>{

cy.zoom(cy.zoom()-0.2);

};


window.centerTree=()=>{

cy.fit();

};



}



loadTree();