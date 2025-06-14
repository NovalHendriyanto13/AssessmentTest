export interface BirthdayRequest {
    firstName: String,
    lastName: String,
    email: String,
    birthday: String,
    timezone: String,
    lastSentYear: Number
}

export interface BirthdayInterface {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    birthday: string,
    timezone: string,
    lastSentYear: Number
}

export interface HTTPHeaders {
    [header: string]: string;
}
export interface ResponseData {
    item: any;
}