


export default {
    /**
     * 格式化时间戳
     * 用法实例:hs_time_format('1560764108','Y-m-d H:i:s');
     * @param timestamp
     * @param fmt
     */
    hs_time_format(timestamp,fmt='Y-m-d H:i:s'){
        let date=null;
        //如果是数字或数字型字符串
        if(!isNaN(timestamp)){
            timestamp=timestamp.toString();
            let timestampLengh=timestamp.length;
            if(timestampLengh==10){//注：php时间戳为10位数字
                date=new Date(timestamp*1000);
            }else{
                date=new Date(timestamp*1);
            }
        }else{
            date=new Date(timestamp);
        }

        let o = {
            "Y" : date.getFullYear(),                //年份
            "m" : date.getMonth()+1,                 //月份
            "d" : date.getDate(),                    //日
            "H" : date.getHours(),                   //小时
            "i" : date.getMinutes(),                 //分
            "s" : date.getSeconds(),                 //秒
        };
        for(let k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt =k=='Y'?fmt.replace(RegExp.$1, o[k]):fmt.replace(RegExp.$1, o[k].toString().padStart(2, 0));
            }
        }
        return fmt;
    },

    /**
     * 根据提供的时间戳，获取下一日起始时间戳
     * @param timestamp
     */
    getNextDayZeroTimestamp(timestamp:number):number {
        // 创建一个Date对象
        let date = new Date(timestamp);

        // 获取下一天的日期
        date.setDate(date.getDate() + 1);
        // 设置小时、分钟、秒和毫秒为0
        date.setHours(0, 0, 0, 0);

        // 返回修改后的时间戳
        return date.getTime();
    },

    /**
     * 秒转换=>分:秒:毫秒的格式
     * @param second
     */
    secToMinSecMilsec(second:number): string  {
        if (second) {
            const minutes = Math.floor(second / 60);
            const remainingSeconds = second % 60;
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = remainingSeconds.toFixed(2).replace('.', ':').padStart(5, '0');
            return `${formattedMinutes}:${formattedSeconds}`; //示例： 02:18:25
        } else {
            return "00:00:00";
        }
    },

    /**
     * 豪秒转换=>分:秒的格式
     * @param millisecond
     */
    milsecToMinSec(millisecond:number): string  {
        if (millisecond) {
            const minutes = Math.floor(millisecond /1000/ 60);
            const remainingSeconds = (millisecond/1000) % 60;
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');
            return `${formattedMinutes}:${formattedSeconds}`; //示例： 02:18
        } else {
            return "00:00";
        }
    }
}