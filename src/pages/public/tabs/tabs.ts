import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { SearchPage } from '../../private/search/search';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = SearchPage;

  constructor() {

  }
}
