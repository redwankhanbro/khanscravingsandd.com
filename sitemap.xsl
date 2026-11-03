<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap | Khan's Cravings</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: "Segoe UI", system-ui, sans-serif;
            background: #fff8f0;
            color: #3a2a1a;
            padding: 48px 20px;
          }
          .wrap { max-width: 860px; margin: 0 auto; }
          header {
            background: linear-gradient(135deg, #ff7a3d, #e8432e);
            color: #fff;
            border-radius: 20px;
            padding: 36px 32px;
            margin-bottom: 28px;
            box-shadow: 0 10px 30px rgba(232, 67, 46, 0.25);
          }
          header h1 { font-size: 2rem; margin-bottom: 8px; }
          header p { opacity: 0.9; }
          .count {
            display: inline-block;
            margin-top: 16px;
            background: rgba(255,255,255,0.2);
            padding: 6px 14px;
            border-radius: 999px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .grid { display: grid; gap: 14px; }
          .card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            background: #fff;
            border: 1px solid #f1dfcc;
            border-radius: 14px;
            padding: 18px 22px;
            text-decoration: none;
            color: inherit;
            transition: transform .15s, box-shadow .15s, border-color .15s;
          }
          .card:hover {
            transform: translateY(-2px);
            border-color: #ff7a3d;
            box-shadow: 0 8px 20px rgba(255, 122, 61, 0.15);
          }
          .page { font-weight: 700; font-size: 1.05rem; }
          .url { font-size: 0.85rem; color: #9a7b60; word-break: break-all; margin-top: 4px; }
          .date {
            white-space: nowrap;
            font-size: 0.8rem;
            font-weight: 600;
            color: #e8432e;
            background: #ffeee4;
            padding: 6px 12px;
            border-radius: 999px;
          }
          footer { text-align: center; margin-top: 32px; font-size: 0.85rem; color: #9a7b60; }
          @media (max-width: 560px) {
            .card { flex-direction: column; align-items: flex-start; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <h1>Khan's Cravings Sitemap</h1>
            <p>Every page on the site, all in one place.</p>
            <span class="count">
              <xsl:value-of select="count(s:urlset/s:url)"/> pages
            </span>
          </header>

          <div class="grid">
            <xsl:for-each select="s:urlset/s:url">
              <a class="card" href="{s:loc}">
                <div>
                  <div class="page">
                    <xsl:variable name="file" select="substring-after(s:loc, 'khanscravingsand/')"/>
                    <xsl:choose>
                      <xsl:when test="$file = ''">Home</xsl:when>
                      <xsl:when test="$file = 'drinks.html'">Drinks</xsl:when>
                      <xsl:when test="$file = 'club.html'">Club</xsl:when>
                      <xsl:when test="$file = 'shops.html'">Shops</xsl:when>
                      <xsl:otherwise><xsl:value-of select="$file"/></xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <div class="url"><xsl:value-of select="s:loc"/></div>
                </div>
                <span class="date">Updated <xsl:value-of select="s:lastmod"/></span>
              </a>
            </xsl:for-each>
          </div>

          <footer>This sitemap helps search engines find every page.</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
