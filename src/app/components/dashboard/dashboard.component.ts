import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  
  // Array to store the list of quotes
  items: any[] = [];

  // Variables for pagination
  page: number = 1;
  limit: number = 1000; // Number of items to load per request
  hasMoreItems: boolean = true; // To manage "Load More" button visibility

  constructor(private quoteService: SharedService, private route: Router) { }

  /**
   * OnInit lifecycle hook to load quotes when the component is initialized.
   */
  ngOnInit(): void {
    this.loadQuotes();
  }

  /**
   * Loads quotes from the service with pagination support.
   * @param page - Current page number (default is 1).
   */
  loadQuotes(page: number = 1): void {
    this.quoteService.getQuotes(this.limit, 0).subscribe((response: any) => {
      
      // If fewer items are returned than the limit, disable further loading
      if (response.data.length < this.limit) {
        this.hasMoreItems = false;
      }

      // If on the first page, replace the items, otherwise append more items
      this.items = page === 1 ? response.data : [...this.items, ...response.data];
    });
  }

  /**
   * Handles page change events from the pagination component.
   * @param page - The new page number.
   */
  onPageChange(page: number): void {
    this.page = page;
    this.loadQuotes(page);
  }

  /**
   * Logs out the user and navigates to the login page.
   */
  logout(): void {
    this.quoteService.logout();
  }

  /**
   * Navigates to the create quote page.
   */
  navigateToCreateQuote(): void {
    this.route.navigate(['/create']);
  }
}
