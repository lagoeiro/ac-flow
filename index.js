const fs = require('fs');
const dbLoader = require('./loaders/database-loader');
const dbProcessor = require('./black-boxes/db-processor');
let processTimeInit;
let loadTime ;
async function init(configFile){
    processTimeInit= Date.now();
    if (!fs.existsSync(configFile)) {
        throw new Error(`File ${configFile} not exists`);
    }    
    try{
        const data = await fs.readFileSync(configFile, {encoding: "utf-8"});
        const json = JSON.parse(data);
        loadTime =  Date.now() -processTimeInit;
        return json;
    }catch(ex){
        throw new Error(`Invalid JSON data!`);
    }
}

async function start(flowData){
    const init = Date.now();
    let resources =[];
    //Load resources
    for(resource of flowData.resources){
        if(resource.type==="database"){
           let db = {};
           db.name = resource.name;
           db.database = await loadDBResource(resource); 
           resources.push(db);
        }
    }
    const loadResourcesTime = Date.Now();
    //Load flow
    let returnData =null;
    let currentFlow = flowData.flow[0];
    
    do{
        if(currentFlow.type==="db"){
            const connection = resources.find(db=> db.name==currentFlow.connection);
            returnData = await dbProcessor(currentFlow.query, connection.connection, currentFlow.data, "mysql", null)
        }
        if(currentFlow.nextFlow){
            currentFlow = flowData.find(f=>f.name==currentFlow.nextFlow);
        }else if(currentFlow.conditional){

        }else{
            break;
        }

    }while(currentFlow);
    

    return {totalTime: Date.now()- processTimeInit, loadTime: loadTime, loadResourcesTime: loadResourcesTime,  processTime: Date.now() - init, status: returnData? "success": "error", data: returnData.data};
}

async function loadDBResource(resource){
    if(resource.dbms==="mysql"){
        return dbLoader.loadMySQLConnection(resource);
    }
}
module.exports = {init: init, start: start}