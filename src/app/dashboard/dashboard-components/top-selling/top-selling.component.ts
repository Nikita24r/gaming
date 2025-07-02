// top-selling.component.ts
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-top-selling',
  standalone: true,
  imports: [CommonModule, FormsModule,  NgFor, NgbPaginationModule],
  templateUrl: './top-selling.component.html'
})
export class TopSellingComponent implements OnInit {
  p: number = 1; // Current page
  itemsPerPage: number = 4; // Items per page
  bookUsers: any[] = []; 
  totalItems: number = 0;
  selectedUser: any = {};
  isLoading: boolean = false;
  searchTerm: string = '';


  constructor(private apiService:ApiService) {
  }

  ngOnInit() {
    this.fetchBookUsers();
  }


// Fetch all contacts
fetchBookUsers(page: number = 1): void {
  this.isLoading = true;
  this.p = page;

  const params: any = {
    page: this.p,
    limit: this.itemsPerPage,
  };

  if (this.searchTerm?.trim()) {
    params.name = this.searchTerm.trim();
  }

  this.apiService.get('book-user', params).subscribe({
    next: (res: any) => {
      this.bookUsers = res.data;
      this.totalItems = res.pagination?.total || 0;
      this.isLoading = false;
    },
    error: () => (this.isLoading = false),
  });
}


  onPageChange(page: number) {
    console.log('Page changed to:', page); // Debug log
    this.fetchBookUsers(page);
  }

  // Helper methods for pagination display
  getStartIndex(): number {
    return (this.p - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.p * this.itemsPerPage, this.totalItems);
  }

  // Helper method to calculate total pages
  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}