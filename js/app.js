import { supabase } from "../database.js";


async function loadParents(){

    const {data,error}=await supabase
    .from("people")
    .select("*")
    .order("id");


    if(error){
        console.log(error);
        return;
    }


    const select=document.getElementById("parentSelect");


    if(!select){
        return;
    }


    select.innerHTML=
    `<option value="">No Parent</option>`;


    data.forEach(person=>{

        const option=document.createElement("option");

        option.value=person.id;

        option.textContent=
        `${person.first_name || ""} ${person.last_name || ""}`;

        select.appendChild(option);

    });

}




async function addPerson(){


    const first=
    document.getElementById("firstName").value;


    const last=
    document.getElementById("lastName").value;


    const parent=
    document.getElementById("parentSelect").value || null;



    if(!first){

        alert("Enter a first name");
        return;

    }



    const {error}=await supabase

    .from("people")

    .insert({

        first_name:first,

        last_name:last,

        parent_id:parent

    });



    if(error){

        alert(error.message);
        console.log(error);
        return;

    }



    location.reload();

}





document.addEventListener(
"DOMContentLoaded",
()=>{


    loadParents();



    const button=
    document.getElementById("addPersonButton");



    if(button){

        button.onclick=addPerson;

    }


});