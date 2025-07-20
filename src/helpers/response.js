const SUCCESS_API_FETCH = (data, message = "Data found successfully!!!") => {
    return {
        status: true,
        message: message,
        data: data
    }
}

const DATA_NOT_FOUND = (message = 'Data not found!!!') => {
    return {
        status: false,
        message: message
    }
}

const LOGOUT = () => {
    return {
        status: true,
        message: 'Logged out successfully!!!'
    }
}

const DATA_SAVED = (message = "Data saved successfully!!!") => {
    return {
        status: true,
        message: message
    }
}

const DATA_UPDATED = (message = "Data updated successfully!!!") => {
    return {
        status: true,
        message: message
    }
}

const PASSWORD_UPDATED = () => {
    return {
        status: true,
        message: 'Password updated successfully'
    }
}

const DATA_DELETED = (message = "Data deleted successfully!!!") => {
    return {
        status: true,
        message: message
    }
}

const DATA_RESTORED = (message = "Data restored successfully!!!") => {
    return {
        status: true,
        message: message
    }
}

module.exports = {
    SUCCESS_API_FETCH,
    DATA_NOT_FOUND,
    LOGOUT,
    DATA_SAVED,
    DATA_UPDATED,
    PASSWORD_UPDATED,
    DATA_DELETED,
    DATA_RESTORED
}