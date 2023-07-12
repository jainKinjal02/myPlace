import { Component, OnInit ,EventEmitter, Output, ViewChild, ElementRef, Input} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent  implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;
  constructor(private platform : Platform) { }


checkPlatformForWeb(){
  if(Capacitor.getPlatform() == 'web') return true;
  return false;


}

  ngOnInit() {
    if((this.platform.is('mobile') && !this.platform.is('hybrid'))
      || this.platform.is('desktop')){
      this.usePicker = true;
    }
  }

  async onPickImage(){
    if(!this.checkPlatformForWeb()){
      const status= await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90, // there are many options ,check official site
        allowEditing: true,
				source: CameraSource.Prompt,
        resultType: CameraResultType.Base64,
        correctOrientation: true,
        width: 600
      }).then(image => {
        this.selectedImage=image.base64String;
        this.imagePick.emit(image.base64String);
      }).catch(error=>{
        console.log(error);
        return false;
      });
    }else{
      this.filePickerRef.nativeElement.click();
      return;
      //console.log('Camera is not available for web');
    }


  }

  onFileChosen(event: Event){
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile){
      return;
    }
    const fr = new FileReader();
    fr.onload = () =>{
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }



}
