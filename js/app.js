console.log("NEW APP.JS LOADED");

import { supabase } from "../database.js";


let people = [];





function generatePublicID(id) {


    const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    let random = "";



    for(let i = 0; i < 6; i++){


        random += letters[
            Math.floor(
                Math.random() * letters.length
            )
        ];


    }



    return `PER-${String(id).padStart(5,"0")}-${random}`;


}








async function loadPeople(){



    const {data,error} =
    await supabase

    .from("people")

    .select("*")

    .order("id");




    if(error){

        console.log(error);

        return;

    }



    people = data;


    loadParentDropdown();



}








function loadParentDropdown(){



    const parentSelect =
    document.getElementById(
        "parentSelect"
    );



    if(!parentSelect){

        return;

    }





    parentSelect.innerHTML = `

    <option value="">
    No Parent
    </option>

    `;





    people.forEach(person => {



        const option =
        document.createElement(
            "option"
        );



        option.value =
        person.id;



        option.textContent =
        `${person.first_name || ""}
        ${person.last_name || ""}`;



        parentSelect.appendChild(option);



    });



}









async function addPerson(){



    const firstName =
    document
    .getElementById("firstName")
    .value
    .trim();




    const middleName =
    document
    .getElementById("middleName")
    ?.value
    .trim()
    || null;





    const lastName =
    document
    .getElementById("lastName")
    .value
    .trim();






    const birthDate =
    document
    .getElementById("birthDate")
    ?.value
    || null;





    const birthPlace =
    document
    .getElementById("birthPlace")
    ?.value
    .trim()
    || null;






    const parentID =
    document
    .getElementById("parentSelect")
    ?.value
    || null;







    if(!firstName){


        alert(
            "Enter a first name"
        );


        return;

    }









    // Create person first

    const {data:person,error} =

    await supabase

    .from("people")

    .insert({

        first_name:firstName,

        middle_name:middleName,

        last_name:lastName,

        birth_date:birthDate,

        birth_place:birthPlace,

        parent_id:parentID

    })

    .select()

    .single();









    if(error){


        console.log(error);


        alert(
            error.message
        );


        return;

    }









    // Create public ID

    const publicID =
    generatePublicID(
        person.id
    );









    // Save public ID

    const {error:updateError} =

    await supabase

    .from("people")

    .update({

        public_id:publicID

    })

    .eq(

        "id",

        person.id

    );









    if(updateError){


        console.log(updateError);


        alert(
            updateError.message
        );


        return;


    }







    alert(

        `${firstName} created\n\n${publicID}`

    );




    location.reload();



}









document.addEventListener(

"DOMContentLoaded",

()=>{


    loadPeople();




    const button =

    document.getElementById(
        "addPersonButton"
    );




    if(button){


        button.onclick =
        addPerson;


    }



});