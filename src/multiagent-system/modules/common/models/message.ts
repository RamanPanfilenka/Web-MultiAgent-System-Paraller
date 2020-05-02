import MessageTypes from './messageTypes';

interface Message {
    type: MessageTypes;
    data: any;
}

export default Message;