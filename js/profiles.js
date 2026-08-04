import { supabase } from "../database.js";


let selectedPerson = null;



export async function openProfile(person){

    selectedPerson = person;


    const profileBox =
    document.getElementById("profileBox");


    if(profileBox){

        profileBox.style.display = "block";

    }



    document.getElementById("profileName").innerHTML =
    `🌳 ${person.first_name || ""} ${person.last_name || ""}`;



    document.getElementById("profileInfo").innerHTML =

    `
    Birth:
    ${person.birth_date || "Unknown"}

    <br><br>

    Biography:
    ${person.biography || "None"}
    `;



    document.getElementById("birthDate").value =
    person.birth_date || "";



    document.getElementById("biography").value =
    person.biography || "";



    await loadRelationshipPeople();

    await loadRelationships();

}




// Load people for relationship dropdown

async function loadRelationshipPeople(){


    const select =
    document.getElementById("relationshipPersonSelect");


    if(!select){

        return;

    }



    const {data,error} = await supabase

    .from("people")

    .select("*")

    .order("first_name");



    if(error){

        console.log(error);

        return;

    }



    select.innerHTML =
    `
    <option value="">
    Choose Person
    </option>
    `;



    data.forEach(person=>{


        if(person.id === selectedPerson.id){

            return;

        }



        const option =
        document.createElement("option");



        option.value = person.id;



        option.textContent =

        `${person.first_name || ""} ${person.last_name || ""}`;



        select.appendChild(option);


    });


}





// Add relationship

async function addRelationship(){


    const personID =

    document.getElementById("relationshipPersonSelect").value;



    const type =

    document.getElementById("relationshipType").value;



    if(!personID){

        alert("Choose a person");

        return;

    }



    const {error} = await supabase

    .from("relationships")

    .insert({

        person_id:selectedPerson.id,

        related_person_id:personID,

        relationship_type:type

    });



    if(error){

        console.log(error);

        alert(error.message);

        return;

    }





    // Add reverse spouse relationship

    if(type === "spouse"){


        await supabase

        .from("relationships")

        .insert({

            person_id:personID,

            related_person_id:selectedPerson.id,

            relationship_type:"spouse"

        });


    }



    await loadRelationships();

}





// Display relationships with names

async function loadRelationships(){


    const list =
    document.getElementById("relationshipList");



    if(!list){

        return;

    }



    const {data,error} = await supabase

    .from("relationships")

    .select("*")

    .eq(

        "person_id",

        selectedPerson.id

    );



    if(error){

        console.log(error);

        return;

    }



    list.innerHTML = "";




    for(const relationship of data){


        const {data:person,error} = await supabase

        .from("people")

        .select("*")

        .eq(

            "id",

            relationship.related_person_id

        )

        .single();



        if(error){

            continue;

        }



        let icon="🔗";



        if(relationship.relationship_type==="spouse"){

            icon="❤️";

        }



        if(relationship.relationship_type==="parent"){

            icon="👨‍👩‍👧";

        }



        if(relationship.relationship_type==="child"){

            icon="👶";

        }




        const item =
        document.createElement("p");



        item.textContent =

        `${icon} ${relationship.relationship_type}: ${person.first_name || ""} ${person.last_name || ""}`;



        list.appendChild(item);


    }


}





// Save profile information

async function saveProfile(){


    if(!selectedPerson){

        return;

    }



    const {error} = await supabase

    .from("people")

    .update({

        birth_date:

        document.getElementById("birthDate").value,


        biography:

        document.getElementById("biography").value

    })

    .eq(

        "id",

        selectedPerson.id

    );



    if(error){

        alert(error.message);

        return;

    }



    location.reload();

}





function closeProfile(){


    const box =
    document.getElementById("profileBox");


    if(box){

        box.style.display="none";

    }

}





document.addEventListener(

"DOMContentLoaded",

()=>{


    const save =
    document.getElementById("saveProfileButton");


    const close =
    document.getElementById("closeProfileButton");


    const add =
    document.getElementById("addRelationshipButton");



    if(save){

        save.onclick = saveProfile;

    }



    if(close){

        close.onclick = closeProfile;

    }



    if(add){

        add.onclick = addRelationship;

    }


});



window.openProfile = openProfile;