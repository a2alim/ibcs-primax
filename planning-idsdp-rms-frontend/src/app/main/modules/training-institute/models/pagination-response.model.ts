export interface PaginationResponse<T> {
    pageSize: number;
    pageNo: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
    data: T;
    lastPage: boolean;
}
