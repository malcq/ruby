import { lazy } from 'react';

const CvBuilder = lazy(() => import('pages/sales/CvBuilder'));
const PortfolioBuilder = lazy(() => import('pages/sales/PortfolioBuilder'));
const ProjectsTable = lazy(() => import('pages/sales/ProjectsTable'));
const CreateProject = lazy(() => import('pages/sales/CreateProject'));
const RequestsTable = lazy(() => import('pages/admin/RequestsTable'));


export default [
  {
    path: '/cv_builder',
    exact: true,
    component: CvBuilder,
    role: ['sales', 'admin'],
    pageTitle: 'Создание CV'
  }, {
    path: '/portfolio_builder',
    exact: true,
    component: PortfolioBuilder,
    role: ['sales', 'admin'],
    pageTitle: 'Создание портфолио'
  }, {
    path: '/projects',
    exact: true,
    component: ProjectsTable,
    role: ['sales', 'admin'],
    pageTitle: 'Список проектов'
  }, {
    path: '/createProject',
    exact: true,
    component: CreateProject,
    role: ['sales', 'admin'],
    pageTitle: 'Создание проекта'
  }, {
    path: '/requestsList',
    exact: true,
    component: RequestsTable,
    role: ['sales', 'admin'],
    pageTitle: 'Список заявок'
  }
];
