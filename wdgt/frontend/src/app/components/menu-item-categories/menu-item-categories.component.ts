import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-menu-item-categories',
  templateUrl: './menu-item-categories.component.html',
  styleUrls: ['./menu-item-categories.component.css']
})
export class MenuItemCategoriesComponent implements OnInit {
  @Input() title = '';

  constructor() { }

  ngOnInit() {
  }

}
