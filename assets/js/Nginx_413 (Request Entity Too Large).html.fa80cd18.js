"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[8493],{6262:(i,s)=>{s.A=(i,s)=>{const n=i.__vccOpts||i;for(const[i,a]of s)n[i]=a;return n}},5160:(i,s,n)=>{n.r(s),n.d(s,{comp:()=>l,data:()=>t});var a=n(641);const e={},l=(0,n(6262).A)(e,[["render",function(i,s){return(0,a.uX)(),(0,a.CE)("div",null,[s[0]||(s[0]=(0,a.Lk)("h1",{id:"_413-request-entity-too-large",tabindex:"-1"},[(0,a.Lk)("a",{class:"header-anchor",href:"#_413-request-entity-too-large"},[(0,a.Lk)("span",null,"413 (Request Entity Too Large)")])],-1)),s[1]||(s[1]=(0,a.Lk)("blockquote",null,[(0,a.Lk)("p",null,"上传文件时报错：请求实体过大"),(0,a.Lk)("p",null,"修改Nginx服务器的请求实体大小限制")],-1)),(0,a.Q3)(" more "),s[2]||(s[2]=(0,a.Fv)('<h3 id="修改配置文件" tabindex="-1"><a class="header-anchor" href="#修改配置文件"><span>修改配置文件</span></a></h3><blockquote><p>vim /etc/nginx/conf.d/default.conf</p></blockquote><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    listen</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">       80</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    listen</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  [::]:80;</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    server_name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  localhost</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    #charset koi8-r;</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    #access_log  /var/log/nginx/host.access.log  main;</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    # 支持上传10M以内的实体</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    client_max_body_size</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 10M</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">    .....</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">    .....</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重启nginx服务" tabindex="-1"><a class="header-anchor" href="#重启nginx服务"><span>重启Nginx服务</span></a></h3><hr><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>',6))])}]]),t=JSON.parse('{"path":"/Nginx/413%20(Request%20Entity%20Too%20Large).html","title":"413 (Request Entity Too Large)","lang":"zh-CN","frontmatter":{"icon":"pen-to-square","date":"2024-10-17T00:00:00.000Z","category":["Nginx"],"tag":["error"],"gitInclude":[]},"headers":[{"level":3,"title":"修改配置文件","slug":"修改配置文件","link":"#修改配置文件","children":[]},{"level":3,"title":"重启Nginx服务","slug":"重启nginx服务","link":"#重启nginx服务","children":[]}],"readingTime":{"minutes":0.31,"words":92},"filePathRelative":"Nginx/413 (Request Entity Too Large).md","localizedDate":"2024年10月17日","excerpt":"\\n<blockquote>\\n<p>上传文件时报错：请求实体过大</p>\\n<p>修改Nginx服务器的请求实体大小限制</p>\\n</blockquote>\\n"}')}}]);