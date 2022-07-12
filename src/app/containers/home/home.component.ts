import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserInfo } from 'src/app/store/reducers/auth.reducer';
import * as fromStore from '../../store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // This "selects" the user info from the NGRX store (auth.reducer.ts) and listens to those changes.
  userInfo$ = this.store.pipe(select(fromStore.getUserInfo));

  // We will assign a subscription variable so that we can unsubscribe from it later
  userInfoSub!: Subscription;

  // We will use this variable to store the user info from the reducer.
  userInfo: UserInfo | null = null;

  // We will use this as an async pipe in the template. No unsubscribing required.
  // Best way to use observerables.
  isLoggedIn$ = this.store.pipe(select(fromStore.isLoggedIn));

  constructor(private store: Store<fromStore.AppState>) {}

  ngOnInit(): void {
    // This method is fine to use, just a few more lines involved. With this format, we must declare
    // userInfo$, userInfoSub, and userInfo in order to declare the pipe, subscription, and final data variable.
    // Useful when you need to listen for all changes, or perform complex logic within the subscription. 
  
    this.userInfoSub = this.userInfo$.subscribe(
      (data) => (this.userInfo = data)
    );
  }

  login(): void {
    // When clicking login, the store will dispatch an action that will use the parameters of Login() (in this case there are none)
    // to either update data in the store, or do some action via effect (which can then be chained to a service, which will update the store.)
    this.store.dispatch(fromStore.Login());
  }

  logout(): void {
    // You can also subscribe to data with just one line using pipe. "take(1)" means that it will
    // unsubscribe after it has recieved its first value.
    this.userInfo$.pipe(take(1)).subscribe(data => console.log(data))
    this.store.dispatch(fromStore.Logout());
  }

  ngOnDestroy(): void {
    // Unsubscribe in order to prevent memory leaks.
    if (this.userInfoSub) {
      this.userInfoSub.unsubscribe();
    }
  }
}
