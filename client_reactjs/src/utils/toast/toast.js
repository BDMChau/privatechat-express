import { notification } from 'antd';

const toast_success = (value) => {
    notification['success']({
        message: value,
        duration: 3
    });
}

const toast_error = (value) => {
    notification['error']({
        message: value,
        duration: 3
    });
}

export {
    toast_success,
    toast_error
}