const db = require('../models/index');

const getRejectReasons = async (req, res) => {
  try {
    const options = {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    };

    const rejectReasons = await db.crm_reject_reasons.findAll(options);
    return res.json(rejectReasons);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRejectReasons,
};
