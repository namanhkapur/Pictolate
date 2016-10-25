var express = require('express');
var app = express();
app.use(express.static("static"));

var tagEng1;
var tagEng2;
var descEng;
var tagTrans1;
var tagTrans2;
var descTrans;
var imgURL;

app.get('/', function(req, res){
    res.sendfile('homepage.html', { root: __dirname + "/static" } );
});
app.get("/process", function(req,res){

    const RapidAPI = require('rapidapi-connect');
    const rapid = new RapidAPI('hacktx api use', '37de3fce-d2b0-4cac-bb4e-b1d76f41787e');
    imgURL = req.param("input");

    rapid.call('MicrosoftComputerVision', 'analyzeImage', { 
        'image': imgURL,
        'details': '',
        'visualFeatures': 'Tags, Description',
        'subscriptionKey': '5d3a25366a51463f98739376ac28ab84'
     
        }).on('success', (payload)=>{
            //var tag = JSON.parse(payload).tags[0].name;
            //console.log(payload);
            tagEng1 = JSON.parse(payload).tags[0].name;
            tagEng2 = JSON.parse(payload).tags[1].name;
            descEng = JSON.parse(payload).description.captions[0].text;
            //message = JSON.parse(payload).tags[0].name + ". " + JSON.parse(payload).tags[1].name  + ". " +  JSON.parse(payload).description.captions[0].text 
            rapid.call('GoogleTranslate', 'translate', { 
                
                'string': tagEng1 + "|" + tagEng2 + "|" + descEng,
                'sourceLanguage': 'en',
                'targetLanguage': req.param("dropdown"),
                'apiKey': 'AIzaSyCdSrPgLT9Ip8OEP_yYetMBAaCaGTwylN0'
             
                }).on('success', (payload)=>{
                    tagTrans1 = payload.split("|")[0];
                    tagTrans2 = payload.split("|")[1];
                    descTrans = payload.split("|")[2];
                    var mu = require('mu2'); // notice the "2" which matches the npm repo, sorry..

                    mu.root = __dirname + '/static'
                    var stream = mu.compileAndRender('finalpage.html', {url: imgURL, tagEng1:tagEng1, tagEng2:tagEng2, tagTrans1:tagTrans1, tagTrans2:tagTrans2,
                        descEng:descEng, descTrans:descTrans})
                    //console.log(stream);

                    stream.pipe(res);


                }).on('error', (payload)=>{
                    res.send(payload);
            })

        }).on('error', (payload)=>{
            res.send(payload);
    });
   
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');


});