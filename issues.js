this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["issues"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "      <li class=\""
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.labels : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " clearfix\">\n	<span>\n	  <a class=\"tx-clr--dk one-line issue-name\" href=\"https://github.com/duckduckgo/zeroclickinfo-"
    + alias4(((helper = (helper = helpers.repo || (depth0 != null ? depth0.repo : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"repo","hash":{},"data":data}) : helper)))
    + "/issues/"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n            "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n          </a>\n	  <span class=\"tx-clr--lt tx-size--small\">\n            created at "
    + alias4(((helper = (helper = helpers.created_at || (depth0 != null ? depth0.created_at : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"created_at","hash":{},"data":data}) : helper)))
    + " by <a class=\"tx-clr--lt\" href=\"https://github.com/"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.login : stack1), depth0))
    + "\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.login : stack1), depth0))
    + "</a> \n	  </span>\n	</span>\n      </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "tag-"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n<div class=\"issues-list\">\n  <section>\n    <header class=\"more-space\">\n      <span class=\"pull-left tx-clr--dk\"><strong>Issues</strong></span>\n    </header>\n    <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n  </section>\n</div>\n\n";
},"useData":true});

$(document).ready(function() {
    var url = "https://api.github.com/search/issues?q=repo%3Aduckduckgo%2Fzeroclickinfo-spice+repo%3Aduckduckgo%2Fzeroclickinfo-fathead+repo%3Aduckduckgo%2Fzeroclickinfo-goodies+repo%3Aduckduckgo%2Fzeroclickinfo-longtail+is%3Aissue+is%3Aopen+label%3A%22Low-Hanging+Fruit%22+no:assignee&type=Issues&ref=searchresults";

    $.getJSON(url, function(data) {
        console.log(data); //debug

        var issues;
        issues = Handlebars.templates.issues(data);

        $('#issues').html(issues);
    });

});
