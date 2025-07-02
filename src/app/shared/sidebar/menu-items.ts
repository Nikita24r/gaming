import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
 
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/add-poem',
    title: 'Add Poem',
    icon: 'bi bi-card-text',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/poem',
    title: 'Poems List',
    icon: 'bi bi-suit-spade',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/table',
    title: 'Book User List',
    icon: 'bi bi-layout-split',
    class: '',
    extralink: false,
    submenu: []
  },
];
