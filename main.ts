function pauseMonitoring () {
    if (isTooHot) {
        isMonitoringPaused = true
        basic.clearScreen()
        stopAnnoyingMusic()
        count = 1
        while (count <= pauseSeconds) {
            led.plotBarGraph(
            count,
            pauseSeconds
            )
            // led.plot((count - 1) * 5 / pauseSeconds, 0)
            count = count + 1
            basic.pause(500)
            basic.clearScreen()
            basic.pause(500)
            if (!(isMonitoringPaused)) {
                break;
            }
        }
        isMonitoringPaused = false
        musicStarted = false
        basic.clearScreen()
    }
}
function toFarenheit (celsius: number) {
    return Math.trunc(1.8 * celsius + 32)
}
// this is my comment
input.onButtonPressed(Button.A, function () {
    switch(mode) {
        case EDIT_TEMP_MODE:
        changeMaxTemperature(-1)
        break
        default:
        if (isMonitoringPaused) {
            isMonitoringPaused = false
        } else {
            pauseMonitoring()
        }
    }
})
input.onButtonPressed(Button.AB, function () {
    basic.clearScreen()
    switch(mode) {
        case EDIT_TEMP_MODE:
        mode = NORMAL_MODE
        basic.showIcon(IconNames.Yes)
        break
        default:
        mode = EDIT_TEMP_MODE
        basic.showIcon(IconNames.Yes)
        basic.clearScreen()
        basic.showNumber(maxTemperature)
        readyIcon.showImage(0)
    }
})
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
    switch(mode) {
        case EDIT_TEMP_MODE:
        changeMaxTemperature(1)
        break
        default:
        basic.showNumber(toFarenheit(input.temperature()))
    }
})
function stopAnnoyingMusic () {
    music.stopMelody(MelodyStopOptions.All)
}
input.onGesture(Gesture.Shake, function () {
    if (isMonitoringPaused) {
        isMonitoringPaused = false
    } else {
        pauseMonitoring()
    }
})
function changeMaxTemperature (change: number) {
    basic.clearScreen()
    temp = maxTemperature
    maxTemperature += change
    if (maxTemperature > MAX_TEMP || maxTemperature < MIN_TEMP) {
        maxTemperature = temp
        basic.showIcon(IconNames.Square)
        readyIcon.showImage(0)
    } else {
        led.plotBarGraph(
        maxTemperature - MIN_TEMP,
        MAX_TEMP - MIN_TEMP
        )
        lastInputTime = control.millis()
        if (!(waitingForInactivity)) {
            waitingForInactivity = true
            control.inBackground(function () {
                while(true) {
                    //control.waitMicros(5000) // wait half a second
                    basic.pause(1000)
                    let currentTime = control.millis()            
                    if ((currentTime - lastInputTime) >= 1000) {
                        break
                    }
                }
                basic.clearScreen()
                basic.showNumber(maxTemperature)
                readyIcon.showImage(0)
                waitingForInactivity = false
            })
        }
    }
}
let temp = 0
let musicStarted = false
let count = 0
let isTooHot = false
let pauseSeconds = 0
let MIN_TEMP = 0
let MAX_TEMP = 0
let lastInputTime = 0
let waitingForInactivity= false
let isMonitoringPaused = false
let maxTemperature = 0
let readyIcon: Image = null
MAX_TEMP = toFarenheit(50)
MIN_TEMP = toFarenheit(21)
let NORMAL_MODE = 1
let EDIT_TEMP_MODE = 2
let mode = NORMAL_MODE
pauseSeconds = 10
maxTemperature = 78
readyIcon = images.createImage(`
    . # . # .
    # . . . #
    # # # # #
    # . . . #
    . # . # .
    `)
basic.showIcon(IconNames.Yes)
basic.forever(function () {
    if (!(isMonitoringPaused) && mode == NORMAL_MODE) {
        if (toFarenheit(input.temperature()) > maxTemperature) {
            isTooHot = true
            if (!(musicStarted)) {
                musicStarted = true
                music.startMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.ForeverInBackground)
            }
            basic.showIcon(IconNames.Sad)
        } else {
            isTooHot = false
            musicStarted = false
            music.stopMelody(MelodyStopOptions.All)
            basic.showIcon(IconNames.Happy)
        }
    }
})
