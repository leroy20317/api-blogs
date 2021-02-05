export type Page<D> = {
  total: number;
  data: D[];
  page: number;
  size: number;
  totalPage: number;
}

export type Result = {
  status: 'success' | 'error';
  message?: string;
  body?: any
}

/**
 * 获取列表
 * @param {集合} db
 * @param {页码} page
 * @param {数量} size
 */
export async function getPage(db, page: number, size: number, filter = {}): Promise<Page<any>> {
  const [total, data] = await Promise.all([
    db.countDocuments(),
    db.find(filter).sort({time: -1}).limit(Number(size)).skip(Number(size) * (page - 1))
  ])

  return {
    total,
    data,
    page: Number(page),
    size: Number(size),
    totalPage: Math.ceil(total / Number(size))
  }
}

// 格式化时间
export function formatNow(): string {
  const padZero = (num: number) => {
    const str = num.toString();
    return str.padStart(2, '0')
  }
  const now = new Date();
  const year = now.getFullYear();
  const mon = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  return `${year}-${padZero(mon)}-${padZero(day)} ${padZero(hour)}:${padZero(min)}:${padZero(sec)}`
}

// 时间戳 转换
export function analysis(time): string {
  // '2020-01-01 00:00:00' 转 ['2020', '01', '01', '00', '00', '00']
  return time.toString().replace(/-|\:|\/|\ /g, ',').split(',');
}

export function dateFormat(timestamp) {
  timestamp = analysis(timestamp)

  const week = ['日', '一', '二', '三', '四', '五', '六'];
  const mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  const weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const enArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const opt = {
    "Y": timestamp[0],
    "M": timestamp[1],
    "D": timestamp[2],
    "H": timestamp[3],
    "m": timestamp[4],
    "w": new Date(Date.parse(`${timestamp[0]}/${timestamp[1]}/${timestamp[2]}`)).getDay(),
  }

  // 日
  let day = opt.D.slice(0, 1) == 0 ? opt.D.slice(1) : opt.D;
  const st = 'st',
      nd = 'nd',
      rd = 'rd',
      th = 'th',
      obj = {
        1: st,
        2: nd,
        3: rd,
        21: st,
        22: nd,
        23: rd,
        31: st
      };

  day += obj[day] ? obj[day] : th;

  const time = {
    date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
    time: `${opt.H}:${opt.m}`,
    year: opt.Y,
    month: {
      on: opt.M,
      cn: mArr[Number(opt.M) - 1],
      en: enArr[Number(opt.M) - 1]
    },
    day: {
      on: opt.D,
      en: day
    },
    week: {
      on: week[opt.w],
      en: weekEn[opt.w],
    }
  }

  return time;
}