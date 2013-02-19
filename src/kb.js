(function () {

  var global = window;
  var GLOBAL_AUTOCOMPLETE_RULES = {}, ES_SCHEME_BY_ENDPOINT = {};

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  function addGlobalAutocompleteRules(parentNode, rules) {
    GLOBAL_AUTOCOMPLETE_RULES[parentNode] = rules;
  }

  function getGlobalAutocompleteRules() {
    return GLOBAL_AUTOCOMPLETE_RULES;
  }


  function addEndpointDescription(endpoint, description) {
    if (!description.endpoint_autocomplete)
      description.endpoint_autocomplete = [endpoint];

    if (!description.match) {
      var l = $.map(description.endpoint_autocomplete, escapeRegex);
      description.match = "(?:" + l.join(")|(?:") + ")";
    }

    if (typeof description.match == "string") description.match = new RegExp(description.match);

    var copiedDescription = {};
    $.extend(copiedDescription, description);
    copiedDescription._id = endpoint;

    ES_SCHEME_BY_ENDPOINT[endpoint] = copiedDescription;
  }

  function getEndpointDescriptionByEndpoint(endpoint) {
    return ES_SCHEME_BY_ENDPOINT[endpoint];
  }

  function getEndpointDescriptionByPath(path) {
    for (var e in ES_SCHEME_BY_ENDPOINT) {
      var s = ES_SCHEME_BY_ENDPOINT[e];
      if (s.match.test(path)) return s;
    }
    return null;
  }

  function getEndpointAutocomplete() {
    var ret = [];
    for (var endpoint in ES_SCHEME_BY_ENDPOINT) {
      ret.push.apply(ret, ES_SCHEME_BY_ENDPOINT[endpoint].endpoint_autocomplete);
    }
    ret.sort();
    return ret;
  }

  function clear() {
    ES_SCHEME_BY_ENDPOINT = {};
    GLOBAL_AUTOCOMPLETE_RULES = {};
  }

  if (!global.sense) global.sense = {};
  global.sense.kb = {};
  global.sense.kb.addGlobalAutocompleteRules = addGlobalAutocompleteRules;
  global.sense.kb.getGlobalAutocompleteRules = getGlobalAutocompleteRules;
  global.sense.kb.addEndpointDescription = addEndpointDescription;
  global.sense.kb.getEndpointAutocomplete = getEndpointAutocomplete;
  global.sense.kb.getEndpointDescriptionByPath = getEndpointDescriptionByPath;
  global.sense.kb.getEndpointDescriptionByEndpoint = getEndpointDescriptionByEndpoint;
  global.sense.kb.clear = clear;


})();