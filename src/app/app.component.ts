import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, map, debounceTime, distinctUntilChanged, switchMap, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('search', { static: true }) search!: ElementRef; // { static: true }
  posts: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const search$ = fromEvent(this.search.nativeElement, 'input')
      .pipe(
        // @ts-ignore
        map(e => e.target.value),
        debounceTime(2000), // результат виден через указанный промежуток времени после окончания ввода
        distinctUntilChanged(), // не делает повторные запросы
        switchMap((value) => this.http.get(`https://api.github.com/search/users?q=${value}`)),
        //@ts-ignore
        map(response => response.items),
        // mergeMap(items => items)
      )
    search$.subscribe(users => {
      console.log(users);

      this.posts = users
      // this.http.get().subscribe(() => {})

    })
  }

  // stream$.subscribe(value => {
  //   console.log(value);
  // })
}
