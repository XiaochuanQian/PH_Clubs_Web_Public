import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema) 