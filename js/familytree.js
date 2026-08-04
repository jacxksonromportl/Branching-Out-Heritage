import { supabase } from "../database.js";

import { openProfile } from "./profiles.js";

import cytoscape from
"https://cdn.jsdelivr.net/npm/cytoscape/+esm";


async function loadTree(){


const tree=document.getElementById("tree");


if(!tree){

    return;

}



const {data,error}=await supabase

.from("people")

.select("*");



if(error){

console.log(error);

return;

}



let nodes=[];

let edges=[];



data.forEach(person=>{


nodes.push({

data:{

id:String(person.id),

label:
`${person.first_name || ""} ${person.last_name || ""}`,

person:person

}

});


});





data.forEach(person=>{


if(person.parent_id){


edges.push({

data:{

id:
"parent-"+person.parent_id+"-"+person.id,

source:String(person.parent_id),

target:String(person.id)

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

selector:"edge",

style:{

width:3,

"line-color":"#555",

"target-arrow-shape":"triangle"

}

}

],



layout:{

name:"breadthfirst",

directed:true

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