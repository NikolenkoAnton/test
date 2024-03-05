export class PaginationResponse<T> {
  rows: T[];
  pages?: number;
  current_page?: number;

  constructor(data?) {
    this.rows = data?.rows;
    this.pages = data?.pages;
    this.current_page = data?.current_page;
  }
}
