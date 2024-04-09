import { Utf8 } from '../Crypto/Utf8.test.js';
import { Hex } from '../Crypto/Hex.test.js';
import { Word32Array } from '../Crypto/lib/Word32Array.test.js';

export default class BaseClass
{
    constructor()
    {
        this.events = {};
        this.anyEvents = [];
        this.singleEvents = {};
    }

    on(eventName, callback)
    {
        if (!this.events[eventName])
        {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    onAny(callback)
    {
        this.anyEvents.push(callback);
    }

    once(eventName, callback)
    {
        if (!this.singleEvents[eventName])
        {
            this.singleEvents[eventName] = [];
        }
        this.singleEvents[eventName].push(callback);
    }

    hexFromString(str)
    {
        let w32 = Utf8.parse(str);
        return w32.toString(Hex);
    }

    byteArrayFromHex(hexString)
    {
        let w32 = Hex.parse(hexString);
        return w32.toUint8Array();
    }

    randomHexBytes(num)
    {
        let byteArray = []
        for (let i = 0; i < num; i++)
        {
            byteArray.push( Math.floor(Math.random() * 255) );
        }
        let w32 = new Word32Array( new Uint8Array(byteArray) );
        return w32.toString(Hex);
    }

    equals(a, b)
    {
        if (a === b) return true; // checks if both references point to the same object
        if (a == null || b == null) return false; // checks if one of the arrays is null
        if (a.length !== b.length) return false; // arrays with different lengths are not equal
    
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false; // as soon as a non-matching element is found, return false
        }
        return true; // if none of the above conditions are met, the arrays are considered equal
    }

    trigger(eventName)
    {
        if (this.events)
        {
            // First do all of the `onAny` events
            if (this.anyEvents.length > 0)
            {
                this.anyEvents.forEach((callback) => {
                    callback.apply(this, arguments);
                });
            }

            // Do the `on` events
            let events = this.events[eventName];
            if (events && events.length > 0)
            {
                [].shift.apply(arguments);
                events.forEach((callback) => {
                    callback.apply(this, arguments); // 'This' should get ignored by binded functions
                });
            }

            // Do the `once` events
            let oneTimeEvents = this.singleEvents[eventName];
            if (oneTimeEvents && oneTimeEvents.length > 0)
            {
                [].shift.apply(arguments);
                oneTimeEvents.forEach((callback) => {
                    callback.apply(this, arguments); // 'This' should get ignored by binded functions
                });
            }
        }
    }

    zeroPad(string, len, rev)
    {
        let zeroPadded = "0".repeat(len);

        if (rev === true)
        {
            zeroPadded = string + zeroPadded;
            return zeroPadded.slice(0, len);
        } else
        {
            zeroPadded = zeroPadded + string;
            return zeroPadded.slice(-len);
        }
        
    }

    rgbToHsv(arr)
    {
        let h = 0;
        let s = 0;
        let v = 0;
        let r = arr[0];
        let g = arr[1];
        let b = arr[2];
        arr.sort(function (a, b) {
          return a - b;
        });
        var max = arr[2];
        var min = arr[0];
        v = max / 255;
        if (max === 0) {
          s = 0;
        } else {
          s = 1 - min / max;
        }
        if (max === min) {
          h = 0;
        } else if (max === r && g >= b) {
          h = 60 * ((g - b) / (max - min)) + 0;
        } else if (max === r && g < b) {
          h = 60 * ((g - b) / (max - min)) + 360;
        } else if (max === g) {
          h = 60 * ((b - r) / (max - min)) + 120;
        } else if (max === b) {
          h = 60 * ((r - g) / (max - min)) + 240;
        }
      
        h = parseInt(h);
        s = parseInt(s * 1000);
        v = parseInt(v * 1000);
        return [h, s, v];
    }
}