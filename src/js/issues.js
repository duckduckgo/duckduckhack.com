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

// Determine Skill and Language from Issues labels
function stripLabelVal(label) {
    var result = label.substring(label.indexOf(':') + 1, label.length);
    return result.trim();
}

// Pull out the info to display from labels:
// - Difficulty and Skill columns
// - Priority: High label
// - Language
function labelsToColumns(issue) {
   issue.skill = [];
   
   for (var i = 0; i < issue.labels.length; i++) {
       var label = issue.labels[i];
       var name = label.name;

       if (name === "Priority: High") {
           issue.high_priority = true;
       } else if (name.match(/Difficulty/)) {
           issue.difficulty = name.match(/Low/) ? "Easy" : "Hard";
       } else if (name.match(/Skill/)) {
           issue.skill.push($.trim(stripLabelVal(name)));
       } else if (name.match(/Topic/)) {
           issue.lang = $.trim(stripLabelVal(name));
       }

       if (issue.length - 1 === i) {
           issue.last = true;
       }   
   }

   return issue;
}

// Main function iterating through the issues from GitHub API,
// pulling out the important information 
// and rendering each issue using the Handlebars template
function groupIssuesByLanguage(issues) {
    $.each(issues, function(key, val) {
        issue = labelsToColumns(val);

        renderIssue(issue);    
    });
}

// Append the give issue to the appropriate Language list
function renderIssue(issue) {
    var rendered_issue = Handlebars.templates.issues(issue);
    issue.lang = (issue.lang === "C++")? "Cplusplus" : issue.lang;
    var $lang_group = $("#" + issue.lang);
    $lang_group.removeClass("hide");
    $lang_group.children("ul").append(rendered_issue);
}

// Render the containers for each Language list
function renderLanguages() {
    var lang_obj = {};
    lang_obj.languages = langs;
    
    var rendered_langs = Handlebars.templates.lang_groups(lang_obj);
    $("#issues_list").html(rendered_langs);
}

$(document).ready(function() {
    var url = 'https://duckduckhack.com/open_issues/';
    
    $.getJSON(url, function(data) {
        renderLanguages();
        groupIssuesByLanguage(data.items);
    });

});
