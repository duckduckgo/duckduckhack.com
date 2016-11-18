var langs = [
    "C",
    "C++",
    "CSS",
    "Java",
    "JavaScript",
    "Perl",
    "PHP",
    "Python",
    "R",
    "Ruby",
    "Swift"
];

function stripLabelVal(label) {
    var result = label.substring(label.indexOf(':') + 1, label.length);
    return result.trim();
}

function groupByLanguage(issues) {
    var by_lang = {};
    by_lang.languages = langs;

    $.each(issues, function(issue) {
        $.each(issue.labels, function(label) {
            if (label === "Priority: High") {
                issue.high_priority = true;
            } else if (label.match(/Difficulty/)) {
                issue.difficulty = label.match(/Low/)? "Easy" : "Hard";
            } else if (label.match(/Skill/) {
                issue.skill = $.trim(stripLabelVal(label));
            } else if (label.match(/Topic/) {
                var lang = $.trim(stripLabelVal(label)));
                if (!by_lang[lang].length) {
                    by_lang[lang] = [];
                }
                
                by_lang[lang].push(issue);
            }
        });
    });

    return by_lang;
}


$(document).ready(function() {
    var url = 'https://api.github.com/search/issues?q=repo%3Aduckduckgo%2Fzeroclickinfo-spice+repo%3Aduckduckgo%2Fzeroclickinfo-fathead+repo%3Aduckduckgo%2Fzeroclickinfo-goodies+repo%3Aduckduckgo%2Fzeroclickinfo-longtail+is%3Aissue+is%3Aopen+no:assignee+label%3A"Mission%3A+Programming"&type=Issues&ref=searchresults&per_page=500';
    $.getJSON(url, function(data) {
        console.log(data); //debug

        data = groupByLanguage(data);

        var issues = Handlebars.templates.issues(data);

        $('#issues').html(issues);
    });

});
