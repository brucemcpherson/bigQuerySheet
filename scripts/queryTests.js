function getAllData() {
  
  var ag = App.globals.bigQuery;
  Logger.log(JSON.stringify(doQuery_ ( 'SELECT * FROM' + 
    ' [' + ag.dataStore + '.' + ag.table + '] LIMIT 10')));
}

function getSomeQuery() {
  
  var ag = App.globals.bigQuery;
  Logger.log(JSON.stringify(doQuery_ ( 'SELECT * FROM' + 
    ' [' + ag.dataStore + '.' + ag.table + '] WHERE iso_country="CA"')));
}


function doQuery_ (sqlString) {
  
  App.init();
  var ag = App.globals.bigQuery;
  return QueryUtils.query (
    App.goa.getProperty("apiKey"), 
    App.goa.getToken(),
    ag.projectId,
    sqlString);

}
