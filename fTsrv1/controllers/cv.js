const fs = require('fs');
const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const readFile = util.promisify(fs.readFile);
const _groupBy = require('lodash/groupBy');
const _get = require('lodash/get');
const size = require('lodash/size');
const find = require('lodash/find');
const config = require('../config');
const db = require('../models/index');
const cvText = require('../templates/cv_text.json');

handlebars.registerHelper('checkLengthArray', (v1, v2, options) => {
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper('getMin', (v1, v2, options) => {
  if (v1 < v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});


handlebars.registerHelper('log', el => console.log('HandleBar_log', el));

handlebars.registerHelper('getIconSrc', (title) => {
  const titleFormated = title.replace(/[\W_]/g, ' ').toLowerCase();

  if (!title) {
    return `${config.url}/public/uploads/technology_icons/noimage.svg`;
  }

  return `${config.url}/public/uploads/technology_icons/ic_${titleFormated}.svg`;
});

/**
 * @swagger
* definitions:
 *   cvRequestModel:
 *     type: object
 *     properties:
 *       farewell:
 *         type: string
 *       user:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           id:
 *             type: number
 *       projects:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: number
 *       isMyData:
 *         type: string
 *       specializedOn:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: string
 *         skills:
 *          type: string
 *         education:
 *          type: string
 *         benefits:
 *          type: string
 *         intro:
 *          type: string
 *         knowledgeTechnology:
 *           type: array
 *           collectionFormat: multi
 *           items:
 *             type: string
 *       rolesInProjects:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: object
 *           properties:
 *             label:
 *               type: string
 *             value:
 *               type: number
 *             role:
 *               type: string
 *             technologies:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                   value:
 *                     type: number
 */

/**
 * @swagger
 *
 * /api/cv/:
 *   post:
 *     summary: Create cv pdf
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/cvRequestModel'
 *     tags:
 *       - cv
 *     responses:
 *       200:
 *         description: cv created
 *       500:
 *         description: error message, probably invalid request
 */

const postCV = async (req, res) => {
  try {
    const {
      language,
      // technologies,
      user,
      employeePosition,
      // benefits,
      isMyData,
      specializedOn,
      skills,
      education,
      projects: projectsOrdering,
      knowledgeTechnology,
      intro,
      rolesInProjects,
      farewell,
    } = req.body;

    const whereUser = isMyData === 'my'
      ? {
        id: user.id,
      }
      : {};
    const whereProject = projectsOrdering.length
      ? {
        id: projectsOrdering,
      }
      : {};

    const presentProjects = await db.project.findAll({
      include: [
        {
          model: db.user,
          required: false,
          where: whereUser,
          attributes: ['firstName', 'lastName'],
          through: {
            attributes: [],
          },
        },
        {
          model: db.technology,
          attributes: ['id', 'title'],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: [
        'id', 'title', 'images', 'href',
        'description', 'description_ru', 'role',
      ],
      where: whereProject,
    });

    if (size(rolesInProjects) > 0) {
      rolesInProjects.forEach((projectObject, index) => {
        const projectData = find(presentProjects, project => project.id === projectObject.value);
        if (projectData) {
          projectData.role = rolesInProjects[index].role;
          projectData.technologies = rolesInProjects[index]
            .technologies
            .map(tech => ({ title: tech.label }));
        }
      });
    }
    if (presentProjects) {
      presentProjects.forEach((project) => {
        if (project.images && project.images.length) {
          project.images = project.images.map(imageSrc => `${config.url}${imageSrc}`);
        }
        if (Array.isArray(project.role)) {
          if (project.role.length > 1) {
            // project.role[0] default projectRole from Company pointOfview for portfolio
            // project.role[1] default projectRole from Developer pointOfview
            // but in case of lack of project.role[1] and no direct defined role,
            // were having the [0] one
            project.role = project.role[1] ? project.role[1].text : '';
          } else {
            project.role = project.role[0] ? project.role[0].text : '';
          }
        }
      });
    }

    const allTechnologies = await db.technology.findAll({
      raw: true,
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
      include: [{
        model: db.techGroup,
      }],
      where: {
        title: knowledgeTechnology,
      },
    });

    let resultTechologies = allTechnologies.map(tech => ({
      title: tech.title,
      type: _get(tech, 'techGroup.title', 'Other') || 'Other',
    }));

    resultTechologies = _groupBy(resultTechologies, tech => tech.type);

    const data = {
      name: user.name,
      projects: [],
      skills,
      education: textCheck(education),
      technologies: specializedOn.join(' / '),
      knowledgeTechnology: resultTechologies,
      // benefits: textCheck(benefits),
      intro: textCheck(intro),
      image: `${config.url}/public/static/white.png`,
      farewell,
      isDeveloper: employeePosition === 'developer',
      text: {
        ...cvText[language],
        ...cvText[language].employeePosition[employeePosition],
      },
    };

    const findRealIndex = ({ id } = {}) => projectsOrdering.indexOf(id);

    presentProjects.forEach((el) => {
      try {
        data.projects[findRealIndex(el)] = el;
      } catch (err) {
        console.error('findRealIndex error', err);
      }
    });

    if (language === 'ru') {
      data.projects.forEach((project) => {
        project.description = project.description_ru;
      });
    }

    const html = await generateHtml(data);
    const browser = await puppeteer.launch({
      // headless: false, // show chromium
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // devtools: true
    });
    const page = await browser.newPage();
    await page.setContent(html, true);
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      // margin: { top: 40, bottom: 40 },
      format: 'A4',
      printBackground: true,
    });

    res.setHeader('Content-Disposition', 'attachment; filename=user_cv.pdf');
    res.type('application/pdf').end(pdf);
    browser.close();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const textCheck = (text = '') => {
  const testText = text.trim();
  if (!testText || /^<p><br><\/p>$/.test(testText)) {
    return false;
  }
  return text;
};

const generateHtml = async (data) => {
  const templatePath = path.resolve('templates', './cv_template.html');

  const content = await readFile(templatePath, 'utf8');
  const template = handlebars.compile(content);

  return template(
    data,
    {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  );
};

module.exports = {
  postCV,
};
