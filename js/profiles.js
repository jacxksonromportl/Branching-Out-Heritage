import { supabase } from "../database.js";


let selected=null;



export function openProfile(person){


selected=person;


document.getElementById("profileBox")
.style.display="block";


document.getElementById("profileName")
.innerHTML=
"🌳 "+
person.first_name+
" "+
(person.last_name || "");



document.getElementById("profileInfo")
.innerHTML=

`
Birth:
${person.birth_date || "Unknown"}

<br><br>

Biography:
${person.biography || "None"}
`;



document.getElementById("birthDate").value=
person.birth_date || "";


document.getElementById("biography").value=
person.biography || "";


}





async function saveProfile(){


if(!selected){

return;

}



await supabase

.from("people")

.update({

birth_date:
document.getElementById("birthDate").value,

biography:
document.getElementById("biography").value

})

.eq(
"id",
selected.id
);



location.reload();


}





document.addEventListener(

"DOMContentLoaded",

()=>{


document.getElementById("saveProfileButton")
.onclick=saveProfile;



document.getElementById("closeProfileButton")
.onclick=()=>{

document.getElementById("profileBox")
.style.display="none";

};


});


window.openProfile=openProfile;