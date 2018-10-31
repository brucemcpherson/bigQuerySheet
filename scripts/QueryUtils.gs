/**
*@namespace QueryUtils
*runs server side and handles all database querying
*/
var QueryUtils = (function (ns) {
  
  /**
  * do a query
  * @param {string} apiKey for billing - apikey should belong to owner fo bigquery project
  * @param {string} accessToken this is a service token to allow this execution api to run as owner of bigquery project
  * @param {string} projectId the project id
  * @param {string} sqlString the string
  * @return {[object]} the results as array of javacript objects
  */
  ns.query = function (apiKey, accessToken, projectId , sqlString) {
    
    
    // we can use exp backoff to get results of job
    var queryJob = cUseful.Utils.expBackoff ( function () {
      return bigQueryFetch_ ( apiKey, accessToken,  projectId, sqlString);
    }, {
      lookahead:function(response , attempt) {
        return !response.jobComplete;
      }
    });
    
    // now retrieve the result
    var result = nextQueryResults_(apiKey , accessToken , queryJob);
    
    // Get all the rows of results.
    var rows = result.rows;
    while (result.pageToken) {
      result = nextQueryResults_ (apiKey, accessToken, result);
      Array.protoype.push.apply (rows,result.rows);
    }
    
    // the headers
    var headers = result.schema.fields.map(function(field) {
      return field.name;
    });
    
    // the rows to an array of obs
    return (rows || []).map(function (d) {
      var idx = 0;
      return headers.reduce(function (p,c) {
        p[c] = d.f[idx].v;
        idx++;
        return p;
      },{});
    });
    
  };
  
  /**
  * take care of returning the pageifed data frm a query
  * @param {string} apiKey for billing - apikey should belong to owner fo bigquery project
  * @param {string} accessToken this is a service token to allow this execution api to run as owner of bigquery project
  * @param {object} queryResult the query result resource
  * @param {object} the next set of results
  */
  function nextQueryResults_ (apiKey , accessToken,  queryResult ) {
    
    var response = cUseful.Utils.expBackoff ( function () {
      return UrlFetchApp.fetch (
        "https://www.googleapis.com/bigquery/v2/projects/" + 
        queryResult.jobReference.projectId + 
        "/queries/" + 
        queryResult.jobReference.jobId + 
        "?apiKey=" + apiKey + (queryResult.pageToken ? 
        ("&pageToken=" + queryResult.pageToken) : ''),  {
        headers:{
          Authorization:"Bearer " + accessToken
        },
          method:"GET"  
      });
    });
    return JSON.parse(response.getContentText());
  }; 
  
  /**
  * do initial query
  * @param {string} apiKey for billing - apikey should belong to owner fo bigquery project
  * @param {string} accessToken this is a service token to allow this execution api to run as owner of bigquery project
  * @param {string} projectId the project id
  * @param {string} sqlString the string
  */
  function bigQueryFetch_ (apiKey, accessToken, projectId, sqlString) {
    
    var body = {
      "kind": "bigquery#queryRequest",
      "query": sqlString
    };
    Logger.log(body);
    var result = cUseful.Utils.expBackoff (function () {
      return UrlFetchApp.fetch ( 
        "https://www.googleapis.com/bigquery/v2/projects/" + projectId + "/queries?apiKey=" + apiKey , {
          method:"POST",
          headers:{
            Authorization:"Bearer " + accessToken
          },
          payload:JSON.stringify(body),
          contentType:"application/json"
       });
    });
  
    return JSON.parse(result.getContentText());
  
   };
                  
   return ns;
}) (QueryUtils || {});


