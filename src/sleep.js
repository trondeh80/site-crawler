function sleep(timeInMillseconds) {
    return new Promise(resolve => setTimeout(resolve, timeInMillseconds));
}

module.exports = sleep;