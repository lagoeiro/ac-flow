const flow = require('./../index')
const main = async () => {
    try {
        const flowData = await flow.init(__dirname + "/config.json");     
        const process = await flow.start(flowData);

        console.log(`Execution result: ${JSON.stringify(process)}`)
    } catch (ex) {
        console.error(ex);
    }
}
main();