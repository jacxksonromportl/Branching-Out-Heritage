import { supabase } from "../database.js";



let people=[];



async function loadPeople(){


    const {data,error}=await supabase

    .from("people")

    .select("*")

    .order("id");



    if(error){

        console.log(error);

        return;

    }



    people=data;


    loadDropdowns();


}





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




    people.forEach(person=>{


        const name =

        `${person.first_name || ""} ${person.last_name || ""}`;



        if(parentSelect){

            const option=document.createElement("option");

            option.value=person.id;

            option.textContent=name;

            parentSelect.appendChild(option);

        }




        if(spouseSelect){

            const option=document.createElement("option");

            option.value=person.id;

            option.textContent=name;

            spouseSelect.appendChild(option);

        }


    });


}





async function addPerson(){


    const firstName=

    document.getElementById("firstName").value;



    const lastName=

    document.getElementById("lastName").value;



    const parentID=

    document.getElementById("parentSelect").value || null;



    const spouseID=

    document.getElementById("spouseSelect").value || null;




    if(!firstName){

        alert("Enter a first name");

        return;

    }




    const {data,error}=await supabase

    .from("people")

    .insert({

        first_name:firstName,

        last_name:lastName,

        parent_id:parentID,

        spouse_id:spouseID

    })

    .select()

    .single();




    if(error){

        alert(error.message);

        console.log(error);

        return;

    }



   // Connect spouse both ways

if(spouseID){


    // Update the person being added

    await supabase

    .from("people")

    .update({

        spouse_id: spouseID

    })

    .eq(

        "id",

        data.id

    );



    // Update the existing spouse

    await supabase

    .from("people")

    .update({

        spouse_id: data.id

    })

    .eq(

        "id",

        spouseID

    );


}




    location.reload();


}





document.addEventListener(

"DOMContentLoaded",

()=>{


    loadPeople();



    const button=

    document.getElementById("addPersonButton");



    if(button){

        button.onclick=addPerson;

    }


});