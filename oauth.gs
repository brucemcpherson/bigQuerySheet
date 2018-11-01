// use  a service account to access my bigquery
function oneOffSetting() { 
  // provoke drive auth DriveApp.getFiles()
  cGoa.GoaApp.setPackage (App.globals.oauth.props , 
   cGoa.GoaApp.createServiceAccount (DriveApp , {
     packageName: App.globals.oauth.packageName,
     fileId:'0B92ExLh4POiZSnRPNmkwX0N6SGM',
     scopes : cGoa.GoaApp.scopesGoogleExpand (['cloud-platform.read-only','bigquery','drive']),
     service:'google_service',
     apiKey:'AIxxxxxxxxxxxxxxHB8'
   }));
}
