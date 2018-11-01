/**
* used to control the App functions
* and hold globals values
* @namespace App
*/
var App = (function (ns) {
  
  ns.globals = {
    bigQuery: {
      projectId:'lateral-command-416',
      dataStore:'airports', //jeopardydata', //
      table:'details'   //questions'
    },
    oauth: {
      packageName:'bigquerysheets',
      props:PropertiesService.getScriptProperties()
    }
  };
  
  ns.init = function () {
    ns.goa = cGoa.GoaApp.createGoa(
      ns.globals.oauth.packageName, 
      ns.globals.oauth.props
    ).execute();
    return ns;
  };
  
  return ns;
}) (App || {});

