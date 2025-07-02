import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from "./dashboard.component";
import { SalesSummaryComponent } from "./dashboard-components/sales-summary/sales-summary.component";
import { FeedsComponent } from "./dashboard-components/feeds/feeds.component";
import { TopSellingComponent } from "./dashboard-components/top-selling/top-selling.component";
import { TopCardsComponent } from "./dashboard-components/top-cards/top-cards.component";

import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Dashboard",
      urls: [{ title: "Dashboard", url: "/dashboard" }, { title: "Dashboard" }],
    },
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    TopSellingComponent,
    NgxPaginationModule,
    NgFor, NgIf
  ],
  declarations: [
    DashboardComponent,
    SalesSummaryComponent,
    FeedsComponent,
    TopCardsComponent
  ],
})
export class DashboardModule {}
