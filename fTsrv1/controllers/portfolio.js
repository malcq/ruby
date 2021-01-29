const fs = require('fs');
const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const size = require('lodash/size');
const find = require('lodash/find');
const db = require('../models/index');

const readFile = util.promisify(fs.readFile);
const config = require('../config');

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

/**
 * @swagger
* definitions:
 *   portfolioRequestModel:
 *     type: object
 *     properties:
 *       mainTitle:
 *         type: string
 *       projects:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: number
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
 * /api/portfolio:
 *   post:
 *     summary: Create portfolio pdf
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/portfolioRequestModel'
 *     tags:
 *       - portfolio
 *     responses:
 *       200:
 *         description: portfolio created
 *       500:
 *         description: err message. probably invalid request body
 */

const postPortfolio = async (req, res) => {
  try {
    const { projects, mainTitle, rolesInProjects } = req.body;

    const whereProject = projects.length
      ? {
        id: projects,
      }
      : {};

    const presentProjects = await db.project.findAll({
      where: whereProject,
      include: [
        {
          model: db.technology,
          attributes: ['id', 'title'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (presentProjects) {
      presentProjects.forEach((project) => {
        if (project.images && project.images.length) {
          project.images = project.images.map(imageSrc => `${config.url}${imageSrc}`);
        }
        if (Array.isArray(project.role)) {
          // project.role[0] default projectRole from Company pointOfview for portfolio
          project.role = project.role[0] ? project.role[0].text : '';
        }
      });
    }

    if (size(rolesInProjects) > 0) {
      rolesInProjects.forEach((projectObject, index) => {
        const projectData = find(presentProjects, project => project.id === projectObject.value);
        if (projectData) {
          projectData.role = rolesInProjects[index].role;
          projectData.technologies = rolesInProjects[index].technologies.map(
            tech => ({ title: tech.label })
          );
        }
      });
    }

    /*
    data object includes paths to images for template because there is
    no another way to pass paths to template
    */
    const data = {
      mainTitle: mainTitle || 'OUR BIG TITLE THERE. CAN BE IN TWO LINES.',
      projects: [],
      siteAddress: config.siteAddress,
      images: {
        white: `${config.url}/public/static/white.png`,
        headerLogo: `${config.url}/public/static/portfolio_images/white.png`,
        teamName: `${config.url}/public/static/portfolio_images/team-name.png`,
        clutch: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_clutch.svg`,
        facebook: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_facebook.svg`,
        goodfirms: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_goodfirms.svg`,
        linkedin: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_linkedin.svg`,
        mail: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_mail.svg`,
        skype: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_skype.svg`,
        upwork: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_upwork.svg`,
        vkontakte: `${
          config.url
        }/public/static/portfolio_images/sm_icons/ic_vkontakte.svg`,
      },
    };

    const findRealIndex = ({ id } = {}) => projects.indexOf(id);

    presentProjects.forEach((el) => {
      try {
        data.projects[findRealIndex(el)] = el;
      } catch (err) {
        console.error('findRealIndex error', err);
      }
    });

    const html = await generateHtml(data);
    const browser = await puppeteer.launch({
      // headless: false, // show chromium
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
    });

    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.pdf');
    res.type('application/pdf').end(pdf);
    browser.close();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const generateHtml = async (data) => {
  const templatePath = path.resolve('templates', './portfolio_template.html');

  const content = await readFile(templatePath, 'utf8');

  handlebars.registerHelper('capitalize', string => string.charAt(0).toUpperCase() + string.slice(1));

  handlebars.registerHelper('log', () => { });

  handlebars.registerHelper('getFirst', (array) => {
    if (array && array.length) {
      return array[0];
    }
  });
  handlebars.registerHelper('removeTags', string => string.replace(/<\/?[^>]+(>|$)/g, ''));

  const template = handlebars.compile(content);
  return template(data);
};

module.exports = {
  postPortfolio,
};
