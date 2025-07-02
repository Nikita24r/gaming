import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { AddPoemComponent } from './add-poem/add-poem.component';
import { PoemComponent } from './poem/poem.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'table',
				component: TableComponent
			},
			{
				path: 'add-poem',
				component: AddPoemComponent
			},
			{
				path: 'poem',
				component: PoemComponent
			},
		]
	}
];
