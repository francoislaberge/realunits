/**
 * lifesized: Get the physical size of displays and their ppi
 */

var electron = require('electron'),
    execSync = require('child_process').execSync,
    exec = require('child_process').exec,
    path = require('path'),
    os = require('os');

var lifesized = {

    /**
     * Get the pixels per inch of a screen
     *
     * @param [display] (Electron Screen Instance) If not provided the display
              this process' BrowserWindow' is over will be used
     */
    ppi: function(display){
        display = display || getBrowserWindowDisplay();
        return getPPI(display);
    },

    /**
     * Get the pixels per inch of a screen
     *
     * @param objectRealSize (Number) Real size of an object in inches
     * @param objectPixelSize (Number) Size of the object in an image in pixels
     * @param [display] (Electron Screen Instance) If not provided the display
              this process' BrowserWindow' is over will be used
     */
    scale: function(objectRealSize, objectPixelSize, display){
        var ppi = lifesized.ppi(display);
        return objectRealSize*ppi/objectPixelSize;
    }
};

/**
 * Get the display that the window is mostly over
 */
function getBrowserWindowDisplay(){
    // Don't require remote unless we hit here as it can't be required in the
    // main process.
    return electron.screen.getDisplayMatching(electron.remote.getCurrentWindow().getBounds());
}

/**
 * Get a screens PPI
 */
function getPPI(display){
    const COMMAND = path.resolve(__dirname, "../build/lifesized-cli/Build/Products/Debug/lifesized-cli") + " " + display.id;
    //console.log(COMMAND);
    // exec( COMMAND, (err, stdout, stderr) => {
    //     debugger;
    // });

    // If on a mac use our native binary to do the work, otherwise fall back
    // to a default
    if(os.platform() === "darwin"){
        try {
            return  parseFloat(
                        execSync(
                            COMMAND
                        )
                    );
        } catch (err) {
            console.error(err);
            return 72.0;
        }
    } else {
        return 72.0;
    }
}

module.exports = lifesized;
