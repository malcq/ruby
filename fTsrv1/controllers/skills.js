const db = require('../models/index');

/**
 * @swagger
 *
 * /api/skills/:
 *   get:
 *     summary: GET all skills records
 *     produces:
 *       - application/json
 *     tags:
 *      - skills
 *     responses:
 *       200:
 *         description: all requests list
 *       500:
 *         description: err mesage
 *
 */

const getSkills = async (req, res) => {
  try {
    const skills = await db.skills.findAll({});
    return res.json(skills);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


module.exports = {
  getSkills,
};
