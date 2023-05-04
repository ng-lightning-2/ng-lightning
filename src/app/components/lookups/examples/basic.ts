import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-demo-lookups-basic',
  templateUrl: './basic.html',
})
export class DemoLookupsBasic {

  superheroes = ['Hulk', 'Flash', 'Superman', 'Batman', 'Spiderman', 'Iron Man', 'Thor', 'Wolverine', 'Deadpool'];
  filteredHeroes$: Observable<any[]>;
  superhero: string = null;

  inputCtrl = new UntypedFormControl();

  open: boolean;

  constructor() {
    this.filteredHeroes$ = this.inputCtrl.valueChanges
      .pipe(
        startWith(''),
        map(val => !val ? [...this.superheroes] : this.filter(val))
      );
  }

  private filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.superheroes.filter(hero => hero.toLowerCase().indexOf(filterValue) > -1);
  }
}
