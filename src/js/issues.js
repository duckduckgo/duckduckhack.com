// Determine Skill and Topic from Issues labels
function stripLabelVal(label) {
    var result = label.substring(label.indexOf(':') + 1, label.length);
    return result.trim();
}

// Pull out the info to display from labels:
// - Difficulty and Skill columns
// - Priority: High label
// - Topic
// - Category
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
       } else if (name.match(/Category/)) {
           issue.category = $.trim(stripLabelVal(name));
       }

       if (issue.length - 1 === i) {
           issue.last = true;
       }
   } // for

   return issue;
}

// Main function iterating through the issues from GitHub API,
// pulling out the important information
// and rendering each issue using the Handlebars template
function groupIssuesByTopic(issues) {
    $.each(issues, function(key, val) {
        issue = labelsToColumns(val);
        if (issue.topic) {
          renderIssue(issue);
        }
    });
}

// Append the give issue to the appropriate Topic list
function renderIssue(issue) {
    var rendered_issue = Handlebars.templates.issues(issue);
    var $topic_group = $(sanitize(issue.category, "#") + " " + sanitize(issue.topic, "."));
    $topic_group.removeClass("hide");
    $topic_group.children("ul").append(rendered_issue);
}

// Render the containers for each Topic list
function renderGroupings(topics, categories) {

    var rendered_topics = Handlebars.templates.topic_groups({
      topics: topics
    }); // render a topics snippet to be used by each category

    var rendered_categories = Handlebars.templates.categories({
      categories: categories
    }); // render the categories

    $("#issues_list").append(rendered_categories);
    $.each(categories, function (key, category) {
      $(sanitize(category, "#")).append(rendered_topics);
    });
}

// Generate a list of items from the issues based on any regular expression.
// Will match against label names.
function generateGroupings(re, issues) {
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

// The following function takes care of escaping these characters and places a "#" at the beginning of the ID string
function sanitize(myid, prefix) {
    // it is possible for a topic label to not exist
    // replace all non alpha-numeric characters with _
    return (myid) ? prefix + myid.replace( /(\+|#|-)/g, "\\$1" ).replace( /\s/g, "_") : "";
}

// Hide the loading element
function dismissLoadingScreen() {
  $('.is-loading').hide();
}

$(document).ready(function() {
    var url = 'https://duckduckhack.com/open_issues/';

    $.getJSON(url, function(data) {
      var issues = data.items;

      var categories = generateGroupings(new RegExp("Category: (.*)"), issues);
      var topics = generateGroupings(new RegExp("Topic: (.*)"), issues);

      dismissLoadingScreen();
      renderGroupings(topics, categories);
      groupIssuesByTopic(issues);
    });
});
