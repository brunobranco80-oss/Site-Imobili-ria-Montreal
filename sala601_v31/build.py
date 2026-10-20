import hashlib
S='/home/claude/landing_v5/before.html'
s=open(S,encoding='utf-8').read()
FAC="https://cdn.jsdelivr.net/gh/brunobranco80-oss/Site-Imobili-ria-Montreal@d0adf67e4dbcbe8b7781636f2920c7ee814bc857/sala601_v5_janela/fotos/30_fachada_real.webp"
OG="https://cdn.jsdelivr.net/gh/brunobranco80-oss/Site-Imobili-ria-Montreal@f50dfe6444ffc432149a7b3fec94200d831d0dd4/sala601_v5_janela/og_sala601_v5.jpg"
URL="https://sala601-imobiliaria-montreal.base44.app/sala601/index.html"
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
# comentário de versão
rep('<!-- LANDING v3 · "REAL PRIMEIRO"','<!-- LANDING v3.1 · "REAL PRIMEIRO" + fachada real e efeitos do taste-skill · página principal desde 20/10/2026 (OK do Bruno) · antes: v3')
# cabeçalho: cartão do link e endereço próprio
rep('<meta property="og:title" content="Trabalhe com vista para o mar no empresarial boutique de Boa Viagem · Sala 601 · Recife – PE">','<meta property="og:title" content="Sala 601 com vista para o mar · Boa Viagem, Recife – PE">')
rep('<link rel="canonical" href="https://sala601-imobiliaria-montreal.base44.app/sala601/index.html">',f'<link rel="canonical" href="{URL}">')
rep('<meta property="og:description" content="46,5 m² para projetar do zero, no 6º andar, com vista para o mar. Alugue agora e comece a pagar o aluguel só em janeiro de 2027 (contratos até 31/10). R$ 5.000,00/mês. Veja o vídeo real da sala.">',
    '<meta property="og:description" content="46,5 m² no 6º andar do Empresarial João Carvalho, em Boa Viagem, Recife – PE. R$ 5.000,00/mês. Assinando até 31/10, o aluguel só começa em janeiro de 2027. Veja o vídeo real e agende sua visita.">')
rep('<meta property="og:url" content="https://sala601-imobiliaria-montreal.base44.app/sala601/index.html"><meta property="og:image" content="https://sala601-imobiliaria-montreal.base44.app/sala601/fotos/og_sala601.jpg?v=2">',
    f'<meta property="og:url" content="{URL}"><meta property="og:image" content="{OG}"><meta property="og:image:secure_url" content="{OG}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Fachada do Empresarial João Carvalho em Boa Viagem: Sala 601 com vista para o mar, R$ 5.000,00/mês"><meta property="og:site_name" content="Imobiliária Montreal"><meta name="twitter:image" content="{OG}">')
rep('<link rel="preload" as="image" href="fotos/t/01_vista_janela_601.webp">','<link rel="preload" as="image" href="fotos/t/01_vista_janela_601.webp">\n<script>try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window&&window.CSS&&CSS.supports("clip-path","inset(0 0 0 0 round 1px)"))document.documentElement.classList.add("fx")}catch(e){}</script>')
# estilos dos efeitos
rep('</style>\n</head>','\n'+open('fx.css',encoding='utf-8').read()+'</style>\n</head>')
# origem: WhatsApp
rep('email: "e-mail", qr: "QR Code na sala" };','email: "e-mail", qr: "QR Code na sala", whatsapp: "WhatsApp", wa: "WhatsApp" };')
# galeria: fachada real no lugar das 2 ilustrações
rep('<span>Toque para ampliar · 16 fotos reais + 2 ilustrações da fachada</span>','<span>Toque para ampliar · 17 fotos reais</span>')
a='      <button type="button" data-src="fotos/23_fachada_noite_ILUSTRATIVA.webp"'
i=s.index(a); k=s.index('\n',s.index('24_fachada_dia_ILUSTRATIVA',i)); s=s[:i]+s[k+1:]
rep('<div class="gal" id="galeria">',f'<div class="gal" id="galeria">\n      <button type="button" class="g-big" data-src="{FAC}" data-cap="Fachada do Empresarial João Carvalho, em Boa Viagem — foto real"><img src="{FAC}" alt="Fachada do Empresarial João Carvalho: torre de vidro e terraço com pergolado no térreo" loading="lazy" width="1200" height="1576"><span><i>Foto real</i> Fachada</span></button>')
# O edifício: a fachada abre de uma janela
rep('''Rua Antônio Falcão com a Av. Conselheiro Aguiar.</p></div>
    <ul class="feat">''',f'''Rua Antônio Falcão com a Av. Conselheiro Aguiar.</p></div>
  </div>
  <div class="janela" id="janela">
    <div class="janela-stage">
      <figure class="janela-fig"><img src="{FAC}" alt="Fachada do Empresarial João Carvalho, torre corporativa de vidro na Rua Antônio Falcão, em Boa Viagem" width="1200" height="1576" loading="lazy" decoding="async"><figcaption><i>Foto real</i>Empresarial João Carvalho · Rua Antônio Falcão, 150</figcaption></figure>
      <p class="janela-txt" aria-hidden="true">O prédio da Sala 601, em foto real</p>
    </div>
  </div>
  <div class="wrap">
    <ul class="feat">''')
# chamada final: fachada real
rep('<figure class="final-fig"><img src="fotos/terraco_cobertura_ilustrativa.webp" alt="Terraço da cobertura do Empresarial João Carvalho com vista para o mar, imagem ilustrativa da construtora" loading="lazy" width="1000" height="750"><figcaption>Imagem ilustrativa · terraço da cobertura</figcaption></figure>',
    f'<figure class="final-fig"><img src="{FAC}" alt="Fachada do Empresarial João Carvalho, em Boa Viagem" loading="lazy" width="1200" height="1576"><figcaption>Foto real · Rua Antônio Falcão, 150</figcaption></figure>')
# entrada antiga sai (a nova, em sequência, fica no fx.js)
a='  // entrada suave dos blocos ao rolar\n'
i=s.index(a); k=s.index('// segurança: nada fica escondido\n  }\n',i)+len('// segurança: nada fica escondido\n  }\n'); s=s[:i]+s[k:]
# script dos efeitos
rep('</body>','<script>\n'+open('fx.js',encoding='utf-8').read()+'</script>\n</body>')
open('index.html','w',encoding='utf-8').write(s)
print(len(s), hashlib.md5(s.encode()).hexdigest())
