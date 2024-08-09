
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'customerScreen_reactjs',
  description: 'The nodejs.org example web server.',
//   script: 'C:\\\icms_project\\common_icms\\general-ICMS\\client\\startProject.js',
  script: 'D:\\customer_screen\\startProject.js',
//   nodeOptions: [
//     '--harmony',
//     '--max_old_space_size=4096'
//   ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
  });

svc.install();
// svc.uninstall();