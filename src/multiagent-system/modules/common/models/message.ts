interface Message<T> {
    unit: T;
    nearestUnits?: Array<T>;
    currentTime?: number;
}

export default Message;