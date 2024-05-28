
/**
 * 秒转换=>分:秒:毫秒的格式
 * @param second
 */
const secToMinSecMilsec = (second:number): string  => {
    if (second) {
        const minutes = Math.floor(second / 60);
        const remainingSeconds = second % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = remainingSeconds.toFixed(2).replace('.', ':').padStart(5, '0');
        return `${formattedMinutes}:${formattedSeconds}`; //示例： 02:18:25
    } else {
        return "00:00:00";
    }
};

/**
 * 豪秒转换=>分:秒的格式
 * @param millisecond
 */
const milsecToMinSec = (millisecond:number): string  => {
    if (millisecond) {
        const minutes = Math.floor(millisecond /1000/ 60);
        const remainingSeconds = (millisecond/1000) % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`; //示例： 02:18
    } else {
        return "00:00";
    }
};

export default {
    secToMinSecMilsec,
    milsecToMinSec
}