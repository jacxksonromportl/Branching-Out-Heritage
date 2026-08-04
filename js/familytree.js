import { supabase } from "../database.js";
import { openProfile } from "./profiles.js";
import cytoscape from "https://cdn.jsdelivr.net/npm/cytoscape/+esm";


async function loadFamilyTree() {


    const container = document.getElementById("tree");


    if (!container) {
        console.log("Tree container not found");
        return;
    }



    const peopleResponse = await supabase
        .from("people")
        .select("*")
        .order("id");


    const marriagesResponse = await supabase
        .from("marriages")
        .select("*")
        .order("id");


    const childrenResponse = await supabase
        .from("marriage_children")
        .select("*")
        .order("id");



    const people = peopleResponse.data;
    const marriages = marriagesResponse.data;
    const marriageChildren = childrenResponse.data;



    if (
        peopleResponse.error ||
        marriagesResponse.error ||
        childrenResponse.error
    ) {

        console.log(
            peopleResponse.error ||
            marriagesResponse.error ||
            childrenResponse.error
        );

        return;

    }



    console.log("People:", people);
    console.log("Marriages:", marriages);
    console.log("Marriage Children:", marriageChildren);




    let nodes = [];
    let edges = [];




    // Create person nodes

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






    // Create marriage nodes

    marriages.forEach(marriage => {


        const marriageNode =
        `marriage-${marriage.id}`;



        let marriageLabel = "❤️";


        if (marriage.marriage_date) {

            marriageLabel +=
            `\n${marriage.marriage_date}`;

        }


        if (marriage.marriage_place) {

            marriageLabel +=
            `\n${marriage.marriage_place}`;

        }



        nodes.push({

            data: {

                id: marriageNode,

                label: marriageLabel,

                type: "marriage"

            }

        });




        // spouse one → marriage

        edges.push({

            data: {

                source:
                `person-${marriage.spouse_one}`,

                target:
                marriageNode

            }

        });





        // spouse two → marriage

        edges.push({

            data: {

                source:
                `person-${marriage.spouse_two}`,

                target:
                marriageNode

            }

        });



    });







    // Marriage → children

    marriageChildren.forEach(record => {


        edges.push({

            data: {

                source:
                `marriage-${record.marriage_id}`,

                target:
                `person-${record.child_id}`

            }

        });


    });






    const cy = cytoscape({

        container: container,


        elements: {

            nodes: nodes,

            edges: edges

        },



        style: [



            {

                selector:
                'node[type="person"]',


                style: {

                    label:
                    "data(label)",


                    "background-color":
                    "#4CAF50",


                    color:
                    "white",


                    width:
                    120,


                    height:
                    120,


                    "text-wrap":
                    "wrap",


                    "text-valign":
                    "center",


                    "text-halign":
                    "center"

                }

            },




            {

                selector:
                'node[type="marriage"]',


                style: {

                    label:
                    "data(label)",


                    "background-color":
                    "#e91e63",


                    color:
                    "white",


                    width:
                    70,


                    height:
                    70,


                    "text-wrap":
                    "wrap",


                    "text-valign":
                    "center",


                    "text-halign":
                    "center"

                }

            },





            {

                selector:
                "edge",


                style: {

                    width:
                    3,


                    "line-color":
                    "#777"

                }

            }



        ],




        layout: {


            name:
            "breadthfirst",


            directed:
            true,


            spacingFactor:
            2,


            padding:
            100

        }


    });






    // Click person

    cy.on(
        "tap",
        'node[type="person"]',
        function(){

            openProfile(
                this.data("person")
            );

        }
    );





    window.centerTree = function(){

        cy.fit();

    };



    window.zoomIn = function(){

        cy.zoom(
            cy.zoom() + .2
        );

    };



    window.zoomOut = function(){

        cy.zoom(
            cy.zoom() - .2
        );

    };



}




document.addEventListener(
    "DOMContentLoaded",
    loadFamilyTree
);