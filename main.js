var saveMove = true;
var save = [];
var __data = {
    "subject": 0,
    "group": 0,
    "length": 0,
    "blocks":{
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
var tab_practice = ["MC","MC","MC","MC","MI","MI","MI","MI"];
var tab_congruent = ["MC","MC","MC","MC","MC","MC","MC","MC","MI","MI"];
var tab_incongruent = ["MI","MI","MI","MI","MI","MI","MI","MI","MC","MC"];

var seq1 = [];
var seq2 = [];
var seq = 0;

var groupe = location.search.replace('?groupe=', '');
groupe = groupe == "" ? '2' : groupe;


var timerStartMove;
var timerInterval;

$('document').ready(function(){


    $("form").validate({
        rules: {
            tranche_age: { required: true },
            rgpd: { required: true }
        },
        messages: {
            tranche_age: { required: "Veuillez sélectionner votre tranche d'âge." },
            rgpd: { required: "Veuillez accepter le règlement général de protection des données." },
        },
        errorPlacement: function(label, element) {
            if (element[0].type == "checkbox") {
                label.addClass('errorMsq');
                label.insertAfter(element.parent());
            } else {
                label.insertAfter(element);
            }
        },
        submitHandler: function(form) {
            const formData = new FormData(form);
            formData.forEach((value, key) => __data[key] = value);
            nextStep('card_formulaire', 'card_presentation');
        }
    });
    initPractice();
    let current_item;
    let mus;
    startExp();


    $('.btn_start').click(async function(e){
        startX = e.screenX;
        startY = e.screenY;
        current_item = dico.shift();
        if(seq > 0){
            if(__data["blocks"][seq] == undefined){
                __data["subject"] = "01";
                __data["group"] = groupe;
                __data["blocks"][seq] = {};
                __data["length"] = dico.length;
            }
            __data["blocks"][seq][__data["length"] - dico.length] = {};
            __data["blocks"][seq][__data["length"] - dico.length]["word"] = current_item.name;
            __data["blocks"][seq][__data["length"] - dico.length]["color"] = current_item.color;
        }
        if(current_item == undefined){return;}
    
        $('.btn_start').css('visibility', 'hidden');
        $('html').css('cursor', 'none');
    
        await new Promise(function(resolve){
            setTimeout(resolve,300)
        })
    
        $(`.btn_start`).attr("disabled",true);
        $('.text').text(current_item.name).css('color', current_item.color).css('visibility', 'unset');
        $('.slowmode').text(!saveMove ? "Veuillez effectuer l'action plus rapidement" : "").css('visibility', !saveMove ? 'unset' : 'hidden');
        $('html').css('cursor', 'auto');
        slowMove();
        timerSaveInitMove();

        mus = new Mus();
        mus.record();
    });

    $('.btn_color').click(async function(){
        mus.stop();
        if(seq > 0){
            mus.frames[0]= ['s', startX, startY];
            mus.getData().frames = mus.getData().frames.filter(elem => elem.shift());
            __data["blocks"][seq][__data["length"] - dico.length]["coordinates"] = mus.getData();
            __data["blocks"][seq][__data["length"] - dico.length]["answer"] = $(this).text();
            __data["blocks"][seq][__data["length"] - dico.length]["error"] = false;
        }
        if($(this).val() != current_item.color){
            await showError();
            if(seq > 0){
                __data["blocks"][seq][__data["length"] - dico.length]["error"] = true;

            }
        }

        await showBtnStart();
        $(`.btn_start`).attr("disabled",false);
        $('.text,.slowmode').css('visibility', 'hidden');

        if(dico.length == 0 && seq == 0){
            nextStep('card_start','card_start_exp');
        }
        else if(dico.length == 0 && seq == 1){
            nextStep('card_start','card_exp_secondpart');
        }
        else if(dico.length == 0 && seq == 2){
            nextStep('card_start','card_end');
            $(".end_exp").click(function(){
                savedata();
            })
        }
    });

    beforeStart();
    displaysequence();
})

/**
 * this fucntion will init the 4 buttons at the same distance from the start buttom 
 */
function initPosition(){
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

/**
 * This function will display the cross after a wring response
 * @returns Promise
 */
function showError(){
    return new Promise(async function(resolve){
        $('.error_color').css('visibility','unset');
        await new Promise(function(resolve){
            setTimeout(resolve,2000)
        });
        $('.error_color').css('visibility','hidden');
        resolve();
    });
}

/**
 * This function will display the buttom start after 500ms
 * @returns promise
 */
function showBtnStart(){
    return new Promise(async function(resolve){
        await new Promise(function(resolve){
            setTimeout(resolve,500)
        });
        $('.btn_start').css('visibility', 'unset');
        resolve();
    });
}

/**
 * this fucntion will display the msg to be more reactive on the iteration
 * @returns promise
 */
async function slowMove(){
    await new Promise(async function(resolve){
        saveMove = false;

        $('html').on('mousemove.move', function(e){
            saveMove = true;
        });
        await new Promise(function(resolve){
            setTimeout(resolve(),500)
        });
        
        $('html').off("mousemove.move");

        resolve(saveMove);
    })

}

function timerSaveInitMove(){

    timerStartMove = 0;

    timerInterval = setInterval(function(){ timerStartMove++ }, 1);    

    $('html').on('mousemove.startmove', function(e){
        clearInterval(timerInterval);
        if(seq > 0){
            __data["blocks"][seq][__data["length"] - dico.length]["timerStartMove"] = timerStartMove;
        }

        $('html').off('mousemove.startmove');
    });
    
}

/**
 * This function will generate the pratice part for the experience
 */
function initPractice(){
    tab_pratice = tab_practice.sort(sortRandom);
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

/**
 * this function will generate the both seq for the experience 
 */
function displaysequence(){
    let results = []
    if(groupe == 1){
        index = [0,1,2,3]
    }
    else{
        index = [2,3,0,1]
    }
    for(let i = 0; i<4; i++){
        results.push(data_congruent[index[0]]);
        results.push(data_congruent[index[1]]);
        results.push(data_incongruent[index[2]]);
        results.push(data_incongruent[index[3]]);
    }

    results.push(data_incongruent[index[0]]);
    results.push(data_incongruent[index[1]]);
    results.push(data_congruent[index[2]]);
    results.push(data_congruent[index[3]]);

    results2 = [...results];


    seq1 = results.sort(sortRandom);
    seq2 = results2.sort(sortRandom);
}

/**
 * This fucntion will return a random number in between min and max 
 * @param {int} min 
 * @param {int} max 
 * @returns 
 */
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * This function will sort a list randomly
 * @returns integer
 */
 function sortRandom() {
    return 0.5 - Math.random();
}

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

/**
 * this function will display the different seq of our experience
 */
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

/**
 * this function will call an other file to save the data
 */
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