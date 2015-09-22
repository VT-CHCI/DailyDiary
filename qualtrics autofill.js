//create Qualtrics.SurveyEngine.QuestionData object
Qualtrics.SurveyEngine.addOnload(function () {

    console.log("michael's custom code is running!");
    console.log(window.location);
    console.log(window.location.hash);

    // remove the leading # and parse the params
    // http://prototypejs.org/doc/latest/language/String/prototype/toQueryParams/
    var pid = window.location.hash.slice(1).toQueryParams('&').pid;
    if (pid) {
        console.log(pid);

        // this value was determined empirically by viewing the source of 
        // the questionnaire once launched
        var questionId = "QR~QID11"; 
        var InputId = document.getElementById(questionId);
        InputId.value = pid;
    }
});
