export enum MessageTypes {
    INITIAL_DATA,
    PONDERING_DATA,
}

export interface Message {
    type: MessageTypes;
    data: any;
}
