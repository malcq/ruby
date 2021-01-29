import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CurrentFeedbackService } from '../_services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
  ) { }

  ngOnInit() {
    this.currentFeedbackService.remove()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
