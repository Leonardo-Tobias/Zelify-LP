import { useParams, Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'

export default function BlogArticle() {
  const { slug } = useParams()
  const article = articles.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <h1 className="text-2xl font-black text-slate-900">Artigo não encontrado</h1>
          <p className="text-sm text-slate-500 font-semibold">O artigo que você procura não existe ou foi removido.</p>
          <Link to="/blog" className="inline-flex items-center space-x-2 text-[#001CFF] text-sm font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o blog</span>
          </Link>
        </div>
      </div>
    )
  }

  const currentIndex = articles.findIndex(a => a.slug === slug)
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-[#001CFF] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o blog</span>
        </Link>

        <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
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

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">
          {article.title}
        </h1>

        <div className="prose prose-slate prose-sm max-w-none leading-relaxed [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:text-slate-600 [&_p]:font-semibold [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:space-y-2 [&_ul]:mb-6 [&_li]:text-slate-600 [&_li]:font-semibold [&_li]:text-sm [&_li]:leading-relaxed [&_strong]:text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 p-6 bg-[#001CFF]/5 border border-[#001CFF]/10 rounded-2xl">
          <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-4">
            {article.cta}
          </p>
          <a
            href={article.ctaLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            <span>Testar Grátis</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {(prevArticle || nextArticle) && (
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link
                to={`/blog/${prevArticle.slug}`}
                className="group p-4 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300/80 transition-all"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anterior</span>
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#001CFF] transition-colors mt-1">
                  {prevArticle.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextArticle && (
              <Link
                to={`/blog/${nextArticle.slug}`}
                className="group p-4 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300/80 transition-all text-right"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Próximo</span>
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#001CFF] transition-colors mt-1">
                  {nextArticle.title}
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
