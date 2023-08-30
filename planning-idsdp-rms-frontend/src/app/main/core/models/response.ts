export interface IResponseHeader {
  requestReceivedTime: Date;
  responseTime: Date;
  hopCount: number;
  responseProcessingTimeInMs: number;
  requestId: string;
  responseCode: string;
  responseMessage: string;
  responseVersion: string;
  requestSourceService: string;
  traceId: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IResponseData {
}

export interface IResponseBody<D extends IResponseData> {
    content: D[];
    pageable: {};
    totalElements: number;
}

export interface IResponse<D extends IResponseData> {
    success: boolean;
    info: boolean;
    warning: boolean;
    message: string;
    valid: boolean;
    model: any;
    items: D[];
    obj: D;
    page: any;
    totalElements: number;
}

export interface CoreResponse<D> {

    success: boolean;
    info: boolean;
    warning: boolean;
    message: string;
    valid: boolean;
    model: any;
    items: D[];
    obj: D;
    page: any;
    totalElements: number;
}

