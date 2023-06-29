import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      title : new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description : new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price : new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom : new FormControl(null,  {
        updateOn : 'blur',
        validators: [Validators.required]
      }),
      dateTo : new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }
  
  onCreateOffer(){
    if (this.form.valid && this.form.get('dateFrom')?.value && this.form.get('dateTo')?.value) {
      console.log(this.form.value);
      // Form is valid and dates are not null, proceed with form submission
    } else {
      // Handle validation error
      console.log('Form is invalid or date fields are empty.');
    }
  }

}
