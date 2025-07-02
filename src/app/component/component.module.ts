import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { TableComponent } from "./table/table.component";
import { AddPoemComponent } from './add-poem/add-poem.component';
import { PoemComponent, TruncatePipe, ShortenUrlPipe } from './poem/poem.component';

@NgModule({
  imports: [
    NgxPaginationModule,
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TableComponent,
    NgxDropzoneModule
  ],
  declarations: [
    AddPoemComponent,
    PoemComponent,
    TruncatePipe,
    ShortenUrlPipe
  ],
})
export class ComponentsModule { }