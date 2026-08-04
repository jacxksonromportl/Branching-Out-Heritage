import { supabase } from "../database.js";

import { openProfile } from "./profiles.js";

import cytoscape from
"https://cdn.jsdelivr.net/npm/cytoscape/+esm";



async function loadTree(){


const tree=document.getElementById("tree");


if(!tree){

return;

}




// Load people

const {data:people,error:peopleError}=await supabase

.from("people")

.select("*");



if(peopleError){

console.log(peopleError);

return;

}




// Load relationships

const {data:relationships,error:relationshipError}=await supabase

.from("relationships")

.select("*");



if(relationshipError){

console.log(relationshipError);

return;

}




let nodes=[];

let edges=[];




// Create people nodes

people.forEach(person=>{


nodes.push({

data:{

id:String(person.id),

label:
`${person.first_name || ""} ${person.last_name || ""}`,

person:person

}

});


});





// Parent connections

people.forEach(person=>{


if(person.parent_id){


edges.push({

data:{

id:
"parent-"+person.parent_id+"-"+person.id,

source:String(person.parent_id),

target:String(person.id),

type:"parent"

}

});


}


});





// Spouse connections

relationships.forEach(rel=>{


if(rel.relationship_type==="spouse"){


edges.push({

data:{

id:
"spouse-"+rel.person_id+"-"+rel.related_person_id,

source:String(rel.person_id),

target:String(rel.related_person_id),

type:"spouse"

}

});


}


});





const cy=cytoscape({


container:tree,



elements:{

nodes:nodes,

edges:edges

},




style:[


{

selector:"node",

style:{

label:"data(label)",

"background-color":"#2e8b57",

color:"white",

width:100,

height:100,

"text-valign":"center",

"text-halign":"center"

}

},



{

selector:'edge[type="parent"]',

style:{

width:3,

"line-color":"#555",

"target-arrow-shape":"triangle"

}

},



{

selector:'edge[type="spouse"]',

style:{

width:3,

"line-color":"#e91e63",

"line-style":"dashed"

}

}


],




layout:{

name:"breadthfirst",

directed:true,

padding:50

}



});





cy.on(

"tap",

"node",

function(){

openProfile(

this.data("person")

);

}

);



}



loadTree();