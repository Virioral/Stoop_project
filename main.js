

var saveMove = true;
var save = [];
var __data = {
    "subject": 0,
    "group": 0,
    "length": 0,
    "trials":{
    }
     

};

var data_congruent = [
    {
        name : 'ROUGE',
        color: 'red'
    },
    {
        name : 'VERT',
        color: 'green'
    },
    {
        name : 'BLEU',
        color: 'blue'
    },
    {
        name : 'JAUNE',
        color: 'yellow'
    },
]


var data_incongruent = [
    {
        name : 'ROUGE',
        color: 'green'
    },
    {
        name : 'VERT',
        color: 'red'
    },
    {
        name : 'BLEU',
        color: 'yellow'
    },
    {
        name : 'JAUNE',
        color: 'blue'
    },
]

var dico = [];
var tab_practice = ["MC","MC","MC","MC","MC","MC","MC","MC","MI","MI","MI","MI","MI","MI","MI","MI"];

var tab_congruent = ["MC","MC","MC","MC","MC","MC","MC","MC","MI","MI"];
var tab_incongruent = ["MI","MI","MI","MI","MI","MI","MI","MI","MC","MC"];

var seq1 = [];
var seq2 = [];
var seq = 0;

var debug;

var groupe = 1;


$('document').ready(function(){

    tab("pratice")
    let current_item;
    let mus;

    startExp();


    $('.btn_start').click(async function(e){
        startX = e.screenX;
        startY = e.screenY;
        current_item = dico.shift();
        if(seq > 0){
            if(__data["trials"][seq] == undefined){
                __data["subject"] = "01";
                __data["group"] = groupe;
                __data["trials"][seq] = {};
                __data["length"] = dico.length;

            }
            __data["trials"][seq][__data["length"] - dico.length] = {};

            __data["trials"][seq][__data["length"] - dico.length]["word"] = current_item.name;
            __data["trials"][seq][__data["length"] - dico.length]["color"] = current_item.color;
        }
        if(current_item == undefined){return;}
    
        $('.btn_start').css('visibility', 'hidden');
        $('html').css('cursor', 'none');
    
        await new Promise(function(resolve){
            setTimeout(resolve,300)
        })
    
        //x => $(document).width()/2, y => pos milieu btn start
        $(`.btn_start`).attr("disabled",true);
        $('.text').text(current_item.name).css('color', current_item.color).css('visibility', 'unset');
        $('.slowmode').text(!saveMove ? "Veuillez effectuer l'action plus rapidement" : "").css('visibility', !saveMove ? 'unset' : 'hidden');

        $('html').css('cursor', 'auto');
        await slowMove();
    

        mus = new Mus();
    
        mus.record();
    });

    $('.btn_color').click(async function(){

        mus.stop();
        if(seq > 0){
            mus.frames[0]= ['s', startX, startY];
            __data["trials"][seq][__data["length"] - dico.length]["coordinates"] = mus.getData();
            save.push(mus.getData());

            __data["trials"][seq][__data["length"] - dico.length]["answer"] = $(this).text();
        }


        if($(this).text() != current_item.name){
            await showError();
            if(seq > 0){
                __data["trials"][seq][__data["length"] - dico.length]["error"] = true;

            }
        }
        await showBtnStart();
        $(`.btn_start`).attr("disabled",false);
        $('.text,.slowmode').css('visibility', 'hidden');

        if(dico.length == 15 && seq == 0){
            nextStep('card_start','card_start_exp');
        }
        if(dico.length == 18 && seq == 1){
            nextStep('card_start','card_exp_secondpart');
        }
        if(dico.length == 18 && seq == 2){
            nextStep('card_start','card_end');
            $(".end_exp").click(function(){
                savedata();
            })
        }



        //drawTrajectory(mus.frames)



        // Starts playing and enjoy
        //mus.play();
    });


    tab_pratice = tab_practice.sort(sortRandom);
    beforeStart();

    displaysequence()


})

function drawTrajectory(data){
    $('#canvas').show();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    let offset = $('.btn_start').offset();
    let height = $('.btn_start').innerHeight();
    let y = offset.top + height/2;

    ctx.moveTo($(document).width()/2, y);
    for(let i = 1; i < data.length; i++){
        ctx.lineTo(data[i][1],data[i][2])
    }
    ctx.lineWidth = 5;
    ctx.stroke();

}

function initPosition(rayon, y){


var offset = $('.btn_start').offset();
var height = $('.btn_start').outerHeight();
var y = offset.top + height/2;

var heightDoc = $(document).height();
var widthDoc = $(document).width()

var rayon = widthDoc < heightDoc ? widthDoc/2.5 : heightDoc/2;

    let current_width_document = $(document).width();
    let x1 = current_width_document/2+rayon*1/2-$('.bloc1').innerWidth()/2;
    let y1 = y-rayon*Math.sqrt(3)/2-$('.bloc1').innerHeight()/2;

    $('.bloc1').css('position', 'absolute').css('top', y1).css('left', x1);

    let x2 = current_width_document/2+rayon*-1/2-$('.bloc2').innerWidth()/2;
    let y2 = y-rayon*Math.sqrt(3)/2-$('.bloc2').innerHeight()/2;

    $('.bloc2').css('position', 'absolute').css('top', y2).css('left', x2);

    let x3 = current_width_document/2+rayon*-Math.sqrt(3)/2-$('.bloc3').innerWidth()/2;
    let y3 = y-rayon*1/2-$('.bloc3').innerHeight()/2;

    $('.bloc3').css('position', 'absolute').css('top', y3).css('left', x3);

    let x4 = current_width_document/2+rayon*Math.sqrt(3)/2-$('.bloc4').innerWidth()/2;
    let y4 = y-rayon*1/2-$('.bloc4').innerHeight()/2;

    $('.bloc4').css('position', 'absolute').css('top', y4).css('left', x4);
}

async function start(dico, mus){

    let val = dico.shift();
    if(val == undefined){return;}

    $('.btn_start').css('visibility', 'hidden');
    $('html').css('cursor', 'none');

    await new Promise(function(resolve){
        setTimeout(resolve,1000)
    })
    let offset = $('.btn_start').offset();
    let height = $('.btn_start').innerHeight();
    let y = offset.top + height/2;

    //x => $(document).width()/2, y => pos milieu btn start
    $(`.btn_start`).attr("disabled",true);
    $('.text').text(val.name).css('color', val.color).css('visibility', 'unset');
    // let $text_slowmode = $('.slowmode');
    // $text_slowmode.css('visibility', text_slowmode.text() == "" ? 'hidden' : 'unset');
    

    $('.btn_start').css('visibility', 'unset');
    $('html').css('cursor', 'auto');

    mus = new Mus();

    // Start recording
    mus.record();
}

function showError(){
    return new Promise(async function(resolve){
        $('.error').css('visibility','unset');
        await new Promise(function(resolve){
            setTimeout(resolve,2000)
        });
        $('.error').css('visibility','hidden');
        resolve();
    });
}

function showBtnStart(){
    return new Promise(async function(resolve){
        await new Promise(function(resolve){
            setTimeout(resolve,500)
        });
        $('.btn_start').css('visibility', 'unset');
        resolve();
    });
}

function slowMove(){
    return new Promise(async function(resolve){
        saveMove = false;

        $('html').on('mousemove', function(e){
            saveMove = true;
        });
        await new Promise(function(resolve){
            setTimeout(resolve,500)
        });
        
        $('html').off('mousemove');
        resolve(saveMove);
    })
}

function tab(val){
    if(val == "pratice"){
        tab_pratice = tab_practice.sort(sortRandom);
        console.log(tab_practice)
        for(let i = 0; i<tab_practice.length; i++){
            let ramdom_number = randomIntFromInterval(0, 3);
            if (tab_practice[i] == "MI"){
                dico.push(data_incongruent[ramdom_number])
            }
            else{
                dico.push(data_congruent[ramdom_number])
            }

        }

    }
}

function displaysequence(groupe){
    let results = [];
    for(let j = 0; j<4; j++){
        let bool = groupe == 1 ? j<2 : j>2;
        if(bool){
            let tab_sort_congruent = tab_congruent.sort(sortRandom);
            for(let i = 0; i<tab_sort_congruent.length; i++){
                if (tab_sort_congruent[i] == "MI"){
                    results.push(data_incongruent[j])
                }
                else{
                    results.push(data_congruent[j])
                }
        
            }
        }
        else{
            let tab_sort_incongruent = tab_incongruent.sort(sortRandom);
            for(let i = 0; i<tab_sort_incongruent.length; i++){
                if (tab_sort_incongruent[i] == "MI"){
                    results.push(data_incongruent[j])
                }
                else{
                    results.push(data_congruent[j])
                }
        
            }
        }

        random_results = results.sort(sortRandom);
        seq1 = random_results.slice(0,20);
        seq2 = random_results.slice(20,40);
        
    }
   


}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}










/**
 * This function will sort a list randomly
 * 
 * @returns integer
 */
 function sortRandom() {
    return 0.5 - Math.random();
}

const rndInt = randomIntFromInterval(1, 6)
console.log(rndInt)

/**
 * This function will hide the old step and show the next one
 * 
 * @param {String} oldstep 
 * @param {String} newstep 
 */
 function nextStep(oldstep, newstep) {
    $('.' + oldstep).addClass('d-none');
    $('.' + newstep).removeClass('d-none');
}

/**
 * This function will display the statement of our experience
 */
 function beforeStart() {
    $('.before_start').on('click', function() {
        nextStep('card_presentation', 'card_start');
        initPosition();
    });
}

function startExp(){
    $('.start_exp').on('click', function() {
        nextStep('card_start_exp', 'card_start');
        seq++;
        if(seq == 1){
            nextStep('card_start_exp', 'card_start');
            dico = seq1;
        } else{
            nextStep('card_exp_secondpart', 'card_start');
            dico = seq2;
        }  
        initPosition();
    });
}


function savedata() {

    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "/m1-miashs-2022-s2/ahc8Ohte/savedata.php";

    // open a connection
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Sending data with the request
    xhr.send(JSON.stringify(__data));
}
















    // displaysequence(1)
    // displaysequence(2)
    // $("form").validate({
    //     rules: {
    //         tranche_age: { required: true },
    //         frequence_utilisation: { required: true },
    //         rgpd: { required: true }
    //     },
    //     messages: {
    //         tranche_age: { required: "Veuillez sélectionner votre tranche d'âge." },
    //         frequence_utilisation: { required: "Veuillez sélectionner votre fréquence d'utilisation." },
    //         rgpd: { required: "Veuillez accepter le règlement général de protection des données." },
    //     },
    //     errorPlacement: function(label, element) {
    //         if (element[0].type == "checkbox") {
    //             label.addClass('errorMsq');
    //             label.insertAfter(element.parent());
    //         } else {
    //             label.insertAfter(element);
    //         }
    //     },
    //     submitHandler: function(form) {
    //         const formData = new FormData(form);
    //         formData.forEach((value, key) => __data[key] = value);
    //         nextStep('card_formulaire', 'card_presentation');
    //         beforeStart();
    //     }
    // });