import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, NgbPaginationModule],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  p: number = 1; // Current page
  itemsPerPage: number = 4; // Items per page
  bookUsers: any[] = []; 
  totalItems: number = 0;
  selectedUser: any = {};
  isLoading: boolean = false;
  searchTerm: string = '';


  // Modal references
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editUserModal') editUserModal!: TemplateRef<any>;
  
  private userToDeleteId: string | null = null;

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  ngOnInit() {
    this.fetchBookUsers();
  }

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

onSearch(): void {
  this.p = 1; // reset to first page on new search
  this.fetchBookUsers();
}


  onPageChange(page: number) {
    console.log('Page changed to:', page); // Debug log
    this.fetchBookUsers(page);
  }

  editUser(user: any) {
    console.log('Editing user:', user); // Debug log
    // Create a deep copy of the user object to avoid reference issues
    this.selectedUser = { 
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      city: user.city,
      age: user.age
    };
    
    const modalRef: NgbModalRef = this.modalService.open(this.editUserModal, { 
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    });
    
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with result:', result);
      }
    ).catch((dismissed) => {
      console.log('Modal dismissed:', dismissed);
    });
  }

  onUpdateUser(modal: NgbModalRef) {
    if (this.selectedUser && this.selectedUser._id) {
      console.log('Updating user:', this.selectedUser); // Debug log
      this.updateUser(this.selectedUser._id, this.selectedUser);
      modal.close('Save');
    }
  }

  updateUser(id: string, updatedUser: any) {
    this.apiService.put('book-user', id, updatedUser).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        // Refresh the current page to show updated data
        this.fetchBookUsers(this.p);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  onDelete(id: string) {
    this.userToDeleteId = id;
    const modalRef: NgbModalRef = this.modalService.open(this.confirmDeleteModal, { 
      ariaLabelledBy: 'modal-basic-title' 
    });
    
    modalRef.result.then(
      (result) => {
        if (result === 'Delete' && this.userToDeleteId) {
          this.deleteUser(this.userToDeleteId);
        }
      }
    ).catch((dismissed) => {
      console.log('Delete modal dismissed:', dismissed);
    });
  }

  deleteUser(id: string) {
    this.apiService.delete('book-user', id).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        // After deletion, check if current page is empty and adjust if needed
        const remainingItems = this.totalItems - 1;
        const maxPage = Math.ceil(remainingItems / this.itemsPerPage);
        
        if (this.p > maxPage && maxPage > 0) {
          this.fetchBookUsers(maxPage);
        } else {
          this.fetchBookUsers(this.p);
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  confirmDelete(modal: NgbModalRef) {
    modal.close('Delete');
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