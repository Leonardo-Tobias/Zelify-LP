import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import BlogLayout from '../components/BlogLayout'

export default function BlogList() {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        <div className="space-y-4 mb-10 sm:mb-16">
          <span className="text-[10px] font-black text-[#001CFF] uppercase tracking-widest">Blog</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Dicas e guias para síndicos e administradoras
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-xl leading-relaxed">
            Tudo o que você precisa saber pra organizar a gestão operacional do seu condomínio.
          </p>
        </div>

        <div className="space-y-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="block bg-white border border-slate-200/70 rounded-2xl p-5 sm:p-8 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 group"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="bg-slate-100 px-2 py-1 rounded-full">{article.category}</span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {article.date}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-[#001CFF] transition-colors mb-3">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mb-4">
                {article.excerpt}
              </p>

              <span className="inline-flex items-center space-x-1.5 text-[10px] font-black text-[#001CFF] uppercase tracking-wider group-hover:gap-1 transition-all">
                <span>Ler artigo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}
