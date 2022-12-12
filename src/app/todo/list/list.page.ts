import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  todos = new Array(15).fill(
    {
      name: 'Todo title',
      detail: 'Sed hendrerit neque ut ante imperdiet...'
    });
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  createTodo(){
    this.router.navigate(['/todo/create']);
  }

}
