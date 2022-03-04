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
