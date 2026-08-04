import { supabase } from "../database.js";
import { openProfile } from "./profiles.js";
import cytoscape from "https://cdn.jsdelivr.net/npm/cytoscape/+esm";


async function loadTree() {

    const tree = document.getElementById("tree");

    if (!tree) {
        return;
    }


    // Load database data

    const { data: people, error: peopleError } = await supabase
        .from("people")
        .select("*");


    const { data: marriages, error: marriageError } = await supabase
        .from("marriages")
        .select("*");


    const { data: marriageChildren, error: childrenError } = await supabase
        .from("marriage_children")
        .select("*");



    if (peopleError || marriageError || childrenError) {

        console.log(
            peopleError ||
            marriageError ||
            childrenError
        );

        return;
    }



    console.log("People:", people);
    console.log("Marriages:", marriages);
    console.log("Marriage Children:", marriageChildren);



    let nodes = [];
    let edges = [];



    // Create people

    people.forEach(person => {

        nodes.push({

            data: {

                id: `person-${person.id}`,

                label:
                `${person.first_name || ""} ${person.last_name || ""}`,

                type: "person",

                person: person

            }

        });

    });





    // Create marriages

    marriages.forEach(marriage => {


        const marriageID =
        `marriage-${marriage.id}`;



        nodes.push({

            data: {

                id: marriageID,

                label: "💍",

                type: "marriage"

            }

        });



        // spouse connections

        edges.push({

            data: {

                source:
                `person-${marriage.spouse_one}`,

                target:
                marriageID,

                type:"spouse"

            }

        });



        edges.push({

            data: {

                source:
                `person-${marriage.spouse_two}`,

                target:
                marriageID,

                type:"spouse"

            }

        });



    });





    // Connect children

    marriageChildren.forEach(child => {


        edges.push({

            data: {

                source:
                `marriage-${child.marriage_id}`,

                target:
                `person-${child.child_id}`,

                type:"child"

            }

        });


    });






    const cy = cytoscape({

        container: tree,


        elements: {

            nodes: nodes,

            edges: edges

        },



        style: [

            {
                selector:'node[type="person"]',

                style: {

                    label:"data(label)",

                    "background-color":"#2e8b57",

                    color:"#ffffff",

                    width:120,

                    height:120,

                    "text-valign":"center",

                    "text-halign":"center",

                    "font-size":14

                }

            },


            {
                selector:'node[type="marriage"]',

                style: {

                    label:"data(label)",

                    "background-color":"#e91e63",

                    color:"#ffffff",

                    width:50,

                    height:50,

                    "text-valign":"center",

                    "text-halign":"center",

                    "font-size":20

                }

            },


            {

                selector:"edge",

                style: {

                    width:3,

                    "line-color":"#555"

                }

            }

        ],



        layout: {

            name:"preset",

            fit:true,

            padding:100

        }


    });







    // Custom family positioning


    let currentX = 200;

    let currentY = 150;



    marriages.forEach(marriage => {



        let spouseOne =
        cy.getElementById(
            `person-${marriage.spouse_one}`
        );


        let spouseTwo =
        cy.getElementById(
            `person-${marriage.spouse_two}`
        );


        let marriageNode =
        cy.getElementById(
            `marriage-${marriage.id}`
        );



        spouseOne.position({

            x:currentX,

            y:currentY

        });



        spouseTwo.position({

            x:currentX+250,

            y:currentY

        });



        marriageNode.position({

            x:currentX+125,

            y:currentY+180

        });





        let kids =
        marriageChildren.filter(

            child =>
            child.marriage_id === marriage.id

        );



        kids.forEach((child,index)=>{


            let childNode =
            cy.getElementById(
                `person-${child.child_id}`
            );


            childNode.position({

                x:
                currentX+(index*180),

                y:
                currentY+400

            });


        });



        currentX += 600;



    });





    cy.fit();





    // Open profile when clicking person

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

    window.zoomIn = () => {

        cy.zoom(
            cy.zoom()+0.2
        );

    };


    window.zoomOut = () => {

        cy.zoom(
            cy.zoom()-0.2
        );

    };


    window.centerTree = () => {

        cy.fit();

    };



}



loadTree();