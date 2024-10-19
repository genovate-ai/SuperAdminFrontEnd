import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileDragAndDrop]'
})
export class FileDragAndDropDirective {

  constructor() { }
//@Input() private allowed_extensions : Array<string> = ['png', 'jpg', 'bmp'];
@Output() private filesChangeEmiter : EventEmitter<File[]> = new EventEmitter()

@HostListener('dragover', ['$event']) public onDragOver(evt){
  evt.preventDefault();
  evt.stopPropagation();
}

@HostListener('dragleave', ['$event']) public onDragLeave(evt){
  evt.preventDefault();
  evt.stopPropagation();
}

@HostListener('drop', ['$event']) public onDrop(evt){
  evt.preventDefault();
  evt.stopPropagation();
  
  let files = evt.dataTransfer.files;
  let valid_files : Array<File> = [];
    for(let i=0; i<files.length;i++){
      if(files[i].type=="image/png"||files[i].type=="image/jpeg"){
        valid_files.push(files[i]);
      }
    }
    if(valid_files.length>0)
    this.filesChangeEmiter.emit(valid_files);
  }
}
