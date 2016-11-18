
$(document).ready(function() {
    var url = 'https://api.github.com/search/issues?q=repo%3Aduckduckgo%2Fzeroclickinfo-spice+repo%3Aduckduckgo%2Fzeroclickinfo-fathead+repo%3Aduckduckgo%2Fzeroclickinfo-goodies+repo%3Aduckduckgo%2Fzeroclickinfo-longtail+is%3Aissue+is%3Aopen+no:assignee+label%3A"Mission%3A+Programming"&type=Issues&ref=searchresults&per_page=500';
    $.getJSON(url, function(data) {
        console.log(data); //debug

        var issues;
        issues = Handlebars.templates.issues(data);

        $('#issues').html(issues);
    });

});
