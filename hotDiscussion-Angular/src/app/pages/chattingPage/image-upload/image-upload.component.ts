import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadMainChattingService } from '../../../http/image/upload-main-chatting.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  pickedFile: File = null;
  pitch: string = "";
  fileName: string = "";
  @Input() mainImageUrl: string = '';
  @Input() name:string=''
  btnToggle: boolean = true;
  @Output() childEvent = new EventEmitter();

  constructor(private toastr: ToastrService, private uploadService: UploadMainChattingService) {}

  ngOnInit() {
  }

  onFilePicked(event){
    this.btnToggle = true
    if (event.target.files[0]){
      this.pickedFile = <File>event.target.files[0]
      this.pitch = ""
      this.fileName = this.pickedFile.name

      let size = Number(this.pickedFile.size)
      let type = this.pickedFile.type
      if (size > 3100000) {
        this.toastr.warning('The image size should be less than 3MB', 'Image Oversize')
        this.pickedFile = null
        this.btnToggle = true
        return
      }
      if (type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
        this.pickedFile = null
        this.btnToggle = true
        this.toastr.warning('Only png, jpg or jpeg image formats are accepted', 'Type error')
        return
      }
      this.btnToggle = false
    }
    else {
      this.pitch = "* No file selected, please select a file to upload"
      this.pickedFile = null
    }
  }

  onUpload(){
    let myImage = new FormData();

    if (!this.pickedFile){
      return this.toastr.info('No file picked', 'Infor')
    }
    if (this.pickedFile){
      myImage.append('image', this.pickedFile, '-' + this.pickedFile.name);
    }

    this.uploadService.submitMainChat(this.mainImageUrl, myImage).subscribe((data) => {
      this.childEvent.emit('Image component')
      this.toastr.success('Your image has been successfully uploaded', 'Success')
      this.pickedFile = null
    }, (error) => {
      this.toastr.error(error.message, 'Failure')
    })

  }



}
