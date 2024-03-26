const bcrypt = require('bcrypt');

const encrypt = async (textoPlano) => {
        const hash = await bcrypt.hash(textoPlano, 10);
        return hash;
};

const compare = async (passwordPlain, hashPassword) => {
     return await bcrypt.compare(passwordPlain, hashPassword)
};

module.exports = {
    encrypt,
    compare,
}