import { lazy } from 'react';

const StaffTable = lazy(() => import('pages/admin/StaffTable'));
const StudentsTasks = lazy(() => import('pages/admin/StudentsTasks'));
const AnnouncementsTable = lazy(() => import('pages/admin/AnnouncementsTable'));

export default [
  {
    path: '/staff',
    exact: true,
    component: StaffTable,
    role: 'admin',
    pageTitle: 'Список сотрудников'
  }, {
    path: '/students_tasks',
    exact: true,
    component: StudentsTasks,
    role: 'admin',
    pageTitle: 'Задания для стажёров'
  }, {
    path: '/announcements',
    exact: true,
    component: AnnouncementsTable,
    role: 'admin',
    pageTitle: 'Объявления'
  }
];
