import { Component, Query,} from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;

  constructor() { }
  onQueryChanged( query: string = ' ' ) {
    if (this.debounceTimer)clearTimeout(this.debounceTimer);
    this.debounceTimer=setTimeout(()=>{
      console.log('mandar este Query:',Query);
    },1000);


    console.log(query)
  }

}
