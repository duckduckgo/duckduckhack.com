// Strip non-alphanumeric chars from a string and transform it to lowercase
Handlebars.registerHelper('slug', function(txt) {
    txt = txt? txt.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    return txt;
});

// Return elapsed time expressed as days from now (e.g. 5 days, 1 day, today)
Handlebars.registerHelper("timeago", function(date, full) {
    var format = "YYYY-MM-DD";
    var timestring = full? " days ago" : "d";
    if (date) {
        // expected date format: YYYY-MM-DDTHH:mm:ssZ e.g. 2011-04-22T13:33:48Z
        date = date.replace(/T.*Z/, "");
        date = moment.utc(date, format);
        
        var elapsed = parseInt(moment().diff(date, "days", true));
        date = elapsed + timestring;

        return date;
    }
});

// Format the full date and convert time to local timezone time
Handlebars.registerHelper("format_time", function(date) {
    if (date) {
        var offset = moment().local().utcOffset();

        // expected date format: YYYY-MM-DDTHH:mm:ssZ e.g. 2011-04-22T13:33:48Z
        date = date.replace("T", " ").replace("Z", " ");
        date = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
        date = date.add(offset, "m");
        date = date.format('D MMM YYYY HH:mm');
        return date;
    }
 });

