var colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    underline: "\x1b[4m",
    flashing: "\x1b[5m",
    reverse: "\x1b[7m",
    fgblack: "\x1b[30m",
    fgred: "\x1b[31m",
    fggreen: "\x1b[32m",
    fgyellow: "\x1b[33m",
    fgblue: "\x1b[34m",
    fgmagenta: "\x1b[35m",
    fgcyan: "\x1b[36m",
    fgwhite: "\x1b[37m",
    bgblack: "\x1b[40m",
    bgred: "\x1b[41m",
    bggreen: "\x1b[42m",
    bgyellow: "\x1b[43m",
    bgblue: "\x1b[44m",
    bgmagenta: "\x1b[45m",
    bgcyan: "\x1b[46m",
    bgwhite: "\x1b[47m"
};

var colorizer = {
    blue: function(s) {
        return colors.fgblue + s + colors.reset;
    },
    bold: function(s) {
        return colors.bold + s + colors.reset;
    },
    cyan: function(s) {
        return colors.fgcyan + s + colors.reset;
    },
    green: function(s) {
        return colors.fggreen + s + colors.reset;
    },
    magenta: function(s) {
        return colors.fgmagenta + s + colors.reset;
    },
    red: function(s) {
        return colors.fgred + s + colors.reset;
    },
    yellow: function(s) {
        return colors.fgyellow + s + colors.reset;
    }
};

module.exports = colorizer;
