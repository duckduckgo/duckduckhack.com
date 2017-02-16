// Determine Skill and Topic from Issues labels
function stripLabelVal(label) {
    var result = label.substring(label.indexOf(':') + 1, label.length);
    return result.trim();
}

// Pull out the info to display from labels:
// - Difficulty and Skill columns
// - Priority: High label
// - Topic
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
           issue.topic = $.trim(stripLabelVal(name));
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
function groupIssuesByTopic(issues) {
    $.each(issues, function(key, val) {
        issue = labelsToColumns(val);

        renderIssue(issue);    
    });
}

// Append the give issue to the appropriate Topic list
function renderIssue(issue) {
    var rendered_issue = Handlebars.templates.issues(issue);
    issue.topic = (issue.topic === "C++")? "Cplusplus" : issue.topic;
    var $topic_group = $("#" + issue.topic);
    $topic_group.removeClass("hide");
    $topic_group.children("ul").append(rendered_issue);
}

// Render the containers for each Topic list
function renderTopics(topics) {
    var topic_obj = {};
    topic_obj.topics = topics;
    
    var rendered_topics = Handlebars.templates.topic_groups(topic_obj);
    $("#issues_list").html(rendered_topics);
}

// Generate a list of topics
function generateTopics(issues) {
    var re = new RegExp('Topic: (.*)'); // matches CSS in "Topic: CSS"
    var topics = [];

    $.each(issues, function (key, issue) {
        // let's assume that we will never have more than one topic assigned to an issue
        for (var i = issue.labels.length - 1; i >= 0; i--) {
            var re_result = issue.labels[i].name.match(re);
            if (re_result) {
                var topic = re_result[1];
                if ($.inArray(topic, topics) === -1) { // $.inArray returns index if found; -1 otherwise
                    topics.push(topic);
                }
            }
        }
    });

    topics.sort();
    
    return topics;
}

$(document).ready(function() {
    var url = 'https://duckduckhack.com/open_issues/';
    
    $.getJSON(url, function(data) {
        renderTopics(generateTopics(data.items));
        groupIssuesByTopic(data.items);
    });

});
