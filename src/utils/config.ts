const isPro = process.env.NODE_ENV === 'production'

export default {
  isPro,
  // port: isPro ? 5001 : 4999,
  port: 5001,
  host: isPro ? '0.0.0.0' : 'localhost',
  // mongodb: 'mongodb://localhost:27017/blogs',
  mongodb: isPro ? 'mongodb://0.0.0.0:27017/blogs' : 'mongodb://152.136.170.96:27017/blogs',
}
