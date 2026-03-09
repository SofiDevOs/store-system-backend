const { check, validationResult } = require("express-validator");

(async () => {
    const req = { body: {} };
    await check("lastname", "El apellido es obligatorio").notEmpty().run(req);
    const errors = validationResult(req);
    const str = JSON.stringify({ errors: errors.array() });
    console.log(str);
    console.log(str.length);
})();
