import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

    isUser: boolean = false;

    constructor(private afAuth: AngularFireAuth, private router: Router) {

        this.afAuth.onAuthStateChanged((user) => {
            if (user) {
              console.log('User is logged in');
              this.isUser = true;
            } else {
              console.log('User is not logged in');
              router.navigate(['/auth/login']);
            }
          });

    }

    ngOnInit(): void {

    }

}
