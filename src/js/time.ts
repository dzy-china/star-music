


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
     * 时间(秒或毫秒)转换为自定义格式的字符串
     * @param time 时间，单位为毫秒或秒
     * @param format 格式字符串，例如 'mm:ss.SSS' 表示分:秒.毫秒
     * @param isMillisecond 输入时间是否为毫秒，默认为true
     * @returns 根据指定格式返回时间字符串
     */
    timeToCustomFormat(time: number, format: string, isMillisecond: boolean = true): string {
        // 如果时间未定义或为0，将格式中的时间单位替换为相应数量的0
        if (!time) return format.replace(/([hmsHMS]+)/g, match => '0'.repeat(match.length));

        // 根据输入是否为毫秒计算总秒数
        const totalSeconds = isMillisecond ? time / 1000 : time;
        // 计算小时数
        const hours = Math.floor(totalSeconds / 3600);
        // 计算分钟数
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        // 计算秒数
        const seconds = Math.floor(totalSeconds % 60);
        // 计算毫秒数
        const milliseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);

        // 格式映射表，用于将时间单位转换为字符串，并根据格式进行填充
        const formatMap = {
            'HH': String(hours).padStart(2, '0'), // 两位小时数，不足补0
            'H': String(hours), // 小时数，不补0
            'mm': String(minutes).padStart(2, '0'), // 两位分钟数，不足补0
            'm': String(minutes), // 分钟数，不补0
            'ss': String(seconds).padStart(2, '0'), // 两位秒数，不足补0
            's': String(seconds), // 秒数，不补0
            'SSS': String(milliseconds).padStart(3, '0'), // 三位毫秒数，不足补0
            'SS': String(Math.floor(milliseconds / 10)).padStart(2, '0'), // 两位毫秒数，不足补0
            'S': String(Math.floor(milliseconds / 100)) // 一位毫秒数
        };

        // 替换格式字符串中的时间单位为实际的时间值
        return format.replace(/(HH|H|mm|m|ss|s|SSS|SS|S)/g, matched => formatMap[matched] || matched);
    }
}