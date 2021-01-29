const path = require('path');
const fs = require('fs');

global.rootRequire = function(name) {
  return require(path.join(__dirname, '../' + name));
};

const appConfig = rootRequire('config');
const initSequelize = rootRequire('factories/sequelize');
const { User, Roles } = rootRequire('models');
const { BadParamsError } = rootRequire('errors');

async function getAdminCredentials () {

  const admin = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures.json'), 'utf-8'));

  admin.emailIsConfirmed = true;
  admin.emailIsConfirmedAt = new Date();

  return admin;
}

async function createAdmin () {

  const credentials = await getAdminCredentials();

  const role = Roles.build({
    roleName: 'admin'
  });

  const user = User.build(credentials);

  try {
    const newRole = await role.save();
    const newUser = await user.save();

    await newUser.addRole(newRole, { through: { role: 'admin' } });
    return newUser
  }

  catch (error) {
    console.log(error);
    throw new BadParamsError('invalid_credentials', 'Cannot create admin');
  }
}

async function startSequelize(config) {
  try {
    const db = await initSequelize(config.postgres, rootRequire('models'));
    return db;
  }
  catch(error) {
    throw new Error(error);
  }
}

startSequelize(appConfig).then(() => createAdmin());
