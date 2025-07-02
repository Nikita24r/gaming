import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { HttpEventType } from '@angular/common/http';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'shortenUrl' })
export class ShortenUrlPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  }
}

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrls: ['./poem.component.scss']
})
export class PoemComponent {
  active2 = 'top';
  collection = [];
  p: number = 1;
  itemsPerPage: number = 4;
  env: any;
  selectedBlog: any = {}; 
  getData: any;
  myForm!: FormGroup;
  image: File[] = [];
  
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;
  
  constructor(
    private _blogService: ApiService, 
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fileServ: FileService,
    private sanitizer: DomSanitizer
  ) {
    this.env = environment.url;
    this.myForm = this.fb.group({
      image: [null, Validators.required],
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)]],
    });
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngOnInit() {
    this.fetchAllBlogs();
  }

  fetchAllBlogs() {
    this._blogService.get('poem', {}).subscribe(
      res => {
        this.getData = res.map((item: any) => ({
          ...item,
          videoLoaded: false,
          hasBeenLoaded: false,
          showError: false
        }));
      },
      error => {
        console.error('Error fetching poems:', error);
      }
    );
  }

  loadVideo(data: any) {
    if (!data.hasBeenLoaded) {
      data.hasBeenLoaded = true;
      data.videoLoaded = true;
    } else {
      data.videoLoaded = !data.videoLoaded;
    }
  }

  getImageDisplayName(image: any): string {
  if (image instanceof File) {
    return image.name;
  }
  return image;
}

  getSafeVideoUrl(url: string): SafeResourceUrl | null {
  if (!url) return null;

  try {
    let videoId: string | null = null;

    if (url.includes('youtu.be/')) {
      // Handles shortened URLs like https://youtu.be/6rRRAVSilss?si=...
      const urlObj = new URL(url);
      videoId = urlObj.pathname.split('/')[1];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
      );
    }

    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      );
    }

    return null;
  } catch (e) {
    console.error('Error processing video URL:', e);
    return null;
  }
}


  getThumbnailImage(imagePath: string): string {
    return imagePath ? 
      `${this.env}/file/download/${imagePath}` : 
      this.getLocalPlaceholder();
  }

  private getLocalPlaceholder(): string {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="16" dy=".5em" text-anchor="middle" x="150" y="100"%3EThumbnail Not Available%3C/text%3E%3C/svg%3E';
  }

  editBlog(blog: any, content: any) {
    this.selectedBlog = { ...blog };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onDelete(id: any) {
    const modalRef = this.modalService.open(this.confirmDeleteModal, { 
      ariaLabelledBy: 'modal-basic-title' 
    });
    
    modalRef.result.then((result) => {
      if (result === 'Delete') {
        this._blogService.delete('poem', id).subscribe(
          res => {
            console.log(res);
            this.fetchAllBlogs();
          },
          error => {
            console.error('Error deleting poem:', error);
          }
        );
      }
    }, () => {
      // Modal dismissed
    });
  }

  confirmDelete(modal: any) {
    modal.close('Delete');
  }

  saveChanges(modal: any) {
    if (this.selectedBlog.image instanceof File) {
      this.fileServ.uploadFile(this.selectedBlog.image).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.Response) {
            const body: any = res.body;
            this.selectedBlog.image = body.file.path;
            this.updateBlog(modal);
          }
        },
        (error) => {
          alert(`Error uploading image: ${error.message}`);
        }
      );
    } else {
      this.updateBlog(modal);
    }
  }

  private updateBlog(modal: any) {
    this._blogService.put('poem', this.selectedBlog._id, this.selectedBlog).subscribe(
      res => {
        this.fetchAllBlogs();
        modal.close();
      },
      error => {
        console.error('Error updating poem:', error);
        alert('Error updating poem');
      }
    );
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBlog.image = file;
    }
  }

  onSelect(event: any): void {
    const file: File = event.addedFiles[0];
    if (file) {
      this.image = [file];
      this.myForm.patchValue({ image: file });
      this.myForm.get('image')?.updateValueAndValidity();
    }
  }

  onRemove(file: File): void {
    if (this.image.includes(file)) {
      this.image = [];
      this.myForm.patchValue({ image: null });
      this.myForm.get('image')?.updateValueAndValidity();
    }
  }
}