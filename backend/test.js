const roles = require('../roles.json');
const isAllowed = roles?.admin?.POST?.includes("/event/register");
console.log(isAllowed ? "/event/register" : undefined);
