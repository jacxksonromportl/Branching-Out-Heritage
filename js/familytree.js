import { supabase } from "../database.js";

import { openProfile } from "./profiles.js";

import cytoscape from
"https://cdn.jsdelivr.net/npm/cytoscape/+esm";



async function loadTree(){


const tree =
document.getElementById("tree");


if(!tree){

return;

}



// Load data

const {data:people,error:peopleError}=await supabase

.from("people")

.select("*");



const {data:marriages,error:marriageError}=await supabase

.from("marriages")

.select("*");



const {data:children,error:childrenError}=await supabase

.from("marriage_children")

.select("*");





if(
peopleError ||
marriageError ||
childrenError
){

console.log(
peopleError ||
marriageError ||
childrenError
);

return;

}





let nodes=[];

let edges=[];




// Add people nodes

people.forEach(person=>{


nodes.push({

data:{

id:"person-"+person.id,

label:

`${person.first_name || ""} ${person.last_name || ""}`,

person:person,

type:"person"

}

});


});





// Add marriage nodes

marriages.forEach(marriage=>{


nodes.push({

data:{

id:"marriage-"+marriage.id,

label:"💍",

type:"marriage"

}

});





edges.push({

data:{

id:

"m1-"+marriage.id,

source:"person-"+marriage.spouse_one,

target:"marriage-"+marriage.id

}

});



edges.push({

data:{

id:

"m2-"+marriage.id,

source:"person-"+marriage.spouse_two,

target:"marriage-"+marriage.id

}

});



});






// Connect children

children.forEach(child=>{


edges.push({

data:{

id:

"child-"+child.marriage_id+"-"+child.child_id,

source:

"marriage-"+child.marriage_id,

target:

"person-"+child.child_id

}

});


});





const cy =
cytoscape({


container:tree,



elements:{

nodes,

edges

},



style:[

{

selector:'node[type="person"]',

style:{

label:"data(label)",

"background-color":"#2e8b57",

color:"white",

width:110,

height:110,

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

width:40,

height:40

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

spacingFactor:2

}



});





cy.on(

"tap",

"node[type='person']",

function(){

openProfile(

this.data("person")

);

}

);



}



loadTree();