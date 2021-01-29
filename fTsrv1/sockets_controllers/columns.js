const db = require('../models/index');


const getColumns = async () => {
  try {
    const columns = await db.crm_columns.findAll({ order: [['id', 'ASC']] });

    if (!columns) {
      throw new Error('no columns found in db');
    }

    return columns;
  } catch (error) {
    console.error(`Error in getColumns method: ${error}`);
  }
};


const updateColumnsChain = async (data) => {
  const { id_column, chain } = data;

  try {
    const column = await db.crm_columns.findById(id_column);

    if (!column) {
      throw new Error('no column found by id');
    }

    await column.update({ idChain: chain });
  } catch (error) {
    console.error(`Error in getColumns method: ${error}`);
  }
};

module.exports = {
  getColumns,
  updateColumnsChain,
};
