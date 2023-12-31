import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../places.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription, switchMap, take } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit ,OnDestroy{
 place : Place;
 isLoading = false;
 isBookable = false;
 private placeSub : Subscription
  constructor(private route: ActivatedRoute , private navCtrl: NavController,
    private placesService : PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService : BookingService,
    private loadingCtrl : LoadingController,
    private authService : AuthService,
    private alertCtrl :AlertController,
    private router : Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(
        take(1),
        switchMap(userId =>{
        if(!userId){
            throw new Error('Found no user!');
        }
        fetchedUserId = userId;
        return this.placesService.getPlace(paramMap.get('placeId'));

      })).subscribe(place=>{
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
        this.isLoading = false;
      }, error => {
          this.alertCtrl.create({
            header: 'An error ocurred!',
            message : 'Could not load place.',
            buttons: [{ text: 'Okay' , handler : ()=>{
              this.router.navigate(['/places/tabs/discover']);
            }}]
          }).then(alertEl => alertEl.present());
      });

    });
  }

  onBookPlace(){
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: ()=>{
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: ()=>{
            this.openBookingModal('random');
          }

        },
        {
          text: 'Cancel',
          role: 'cancel'

        }
      ]
    }).then(actionSheetEl =>{
      actionSheetEl.present();
    })

  }
  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking place...' })
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  async openLink() {
    await Browser.open({ url: 'https://www.france.fr/en/paris' });
}

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
