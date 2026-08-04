import { supabase } from "../database.js";

console.log("NEW APP.JS LOADED");

let people = [];


// Generate public ID: 5 numbers + 6 letters
function generatePublicID() {

    const numbers = Math.floor(
        10000 + Math.random() * 90000
    );

    const letters = Array.from(
        { length: 6 },
        () =>
            String.fromCharCode(
                65 + Math.floor(Math.random() * 26)
            )
    ).join("");

    return `${numbers}-${letters}`;

}


// Load people for dropdowns
async function loadPeople() {

    const { data, error } = await supabase
        .from("people")
        .select("*")
        .order("id");


    if(error){

        console.error(error);
        return;

    }


    people = data || [];

    loadDropdowns();

}



// Load parent and spouse selections
function loadDropdowns(){

    const parentSelect =
        document.getElementById("parentSelect");

    const spouseSelect =
        document.getElementById("spouseSelect");


    if(parentSelect){

        parentSelect.innerHTML =
        `<option value="">No Parent</option>`;

    }


    if(spouseSelect){

        spouseSelect.innerHTML =
        `<option value="">No Spouse</option>`;

    }



    people.forEach(person => {


        const name =
        `${person.first_name || ""} ${person.last_name || ""}`;


        if(parentSelect){

            const option =
            document.createElement("option");

            option.value = person.id;

            option.textContent = name;

            parentSelect.appendChild(option);

        }



        if(spouseSelect){

            const option =
            document.createElement("option");

            option.value = person.id;

            option.textContent = name;

            spouseSelect.appendChild(option);

        }


    });


}




// Add new person
async function addPerson(){


    const firstName =
    document.getElementById("firstName").value.trim();


    const lastName =
    document.getElementById("lastName").value.trim();


    const parentID =
    document.getElementById("parentSelect")?.value || null;


    const spouseID =
    document.getElementById("spouseSelect")?.value || null;



    if(!firstName){

        alert("Enter a first name");

        return;

    }



    const person = {


        first_name:firstName,

        last_name:lastName,

        public_id:generatePublicID(),

        parent_id:parentID,

        spouse_id:spouseID


    };



    const { data, error } = await supabase

    .from("people")

    .insert(person)

    .select()

    .single();



    if(error){

        console.error(error);

        alert(error.message);

        return;

    }



    // Connect spouse both ways

    if(spouseID){


        await supabase

        .from("people")

        .update({

            spouse_id:data.id

        })

        .eq(

            "id",

            spouseID

        );


    }



    alert(
        `Added ${firstName}`
    );


    location.reload();


}



// Start page

document.addEventListener(

"DOMContentLoaded",

()=>{


    loadPeople();


    const button =
    document.getElementById(
        "addPersonButton"
    );


    if(button){

        button.addEventListener(
            "click",
            addPerson
        );

    }


});