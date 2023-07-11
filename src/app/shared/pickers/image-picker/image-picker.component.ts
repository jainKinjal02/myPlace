import { Component, OnInit ,EventEmitter, Output} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent  implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  selectedImage: string;

  constructor() { }


checkPlatformForWeb(){
  if(Capacitor.getPlatform() == 'web') return true;
  return false;


}

  ngOnInit() {}

  async onPickImage(){
    if(!this.checkPlatformForWeb()){
      const status= await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90, // there are many options ,check official site
        allowEditing: true,
				source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl,
        correctOrientation: true,
        width: 600
      }).then(image => {
        this.selectedImage=image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      }).catch(error=>{
        console.log(error);
        return false;
      });
    }else{
      console.log('Camera is not available for web');
    }


  }

}
