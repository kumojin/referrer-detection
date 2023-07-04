import SearchEngineDetection from './search-engine-detection';
import { parseUrl } from './url.helper';

describe('Search Engine Detection', () => {
  it.each([
    ['', false],
    ['http://uk.search.yahoo.com/search?p=piwik&ei=UTF-8&fr=moz2', 'Yahoo!'],
    ['http://www.google.com/search?hl=en&q=+piWIk+&btnG=Google+Search&aq=f&oq=', 'Google'],
    [
      'http://images.google.com/imgres?imgurl=http://www.linux-corner.info/snapshot1.png&imgrefurl=http://www.oxxus.net/blog/archives/date/2007/10/page/41/&usg=__-xYvnp1IKpRZKjRDQVhpfExMkuM=&h=781&w=937&sz=203&hl=en&start=1&tbnid=P9LqKMIbdhlg-M:&tbnh=123&tbnw=148&prev=/images%3Fq%3Dthis%2Bmy%2Bquery%2Bwith%2Bhttp://domain%2Bname%2Band%2Bstrange%2Bcharacters%2B%2526%2B%255E%2B%257C%2B%253C%253E%2B%2525%2B%2522%2B%2527%2527%2BEOL%26gbv%3D2%26hl%3Den%26sa%3DG',
      'Google Images',
    ],
    [
      'http://www.google.fr/search?hl=en&q=%3C%3E+%26test%3B+piwik+%26quot%3B&ei=GcXJSb-VKoKEsAPmnIjzBw&sa=X&oi=revisions_inline&ct=unquoted-query-link',
      'Google',
    ],
    [
      'http://www.baidu.com/s?ie=gb2312&bs=%BF%D5%BC%E4+hao123+%7C+%B8%FC%B6%E0%3E%3E&sr=&z=&cl=3&f=8&tn=baidu&wd=%BF%D5%BC%E4+%BA%C3123+%7C+%B8%FC%B6%E0%3E%3E&ct=0',
      'Baidu',
    ],
    [
      'http://www.baidu.com/s?kw=&sc=web&cl=3&tn=sitehao123&ct=0&rn=&lm=&ie=gb2312&rs2=&myselectvalue=&f=&pv=&z=&from=&word=%B7%E8%BF%F1%CB%B5%D3%A2%D3%EF+%D4%DA%CF%DF%B9%DB%BF%B4',
      'Baidu',
    ],
    ['http://www.baidu.com/s?wd=%C1%F7%D0%D0%C3%C0%D3%EF%CF%C2%D4%D8', 'Baidu'],
    [
      'http://www.sogou.com/web?query=%C6%F3%D2%B5%CD%C6%B9%E3&_asf=www.sogou.com&_ast=1365135191&w=01019900&p=40040100&sut=559&sst0=1365135191315',
      'Sogou',
    ],
    [
      'http://www.baidu.com/s?ch=14&ie=utf-8&wd=%E4%BA%8C%E5%BA%A6%E5%AE%AB%E9%A2%88%E7%B3%9C%E7%83%82%E8%83%BD%E6%B2%BB%E5%A5%BD%E5%90%97%3F&searchRadio=on',
      'Baidu',
    ],
    ['http://web.gougou.com/search?search=%E5%85%A8%E9%83%A8&id=1', 'Baidu'],
    [
      'http://www.google.cn/search?hl=zh-CN&q=%E6%B5%8F%E8%A7%88%E5%85%AC%E4%BA%A4%E5%9C%B0%E9%93%81%E7%AB%99%E7%82%B9%E4%BF%A1%E6%81%AF&btnG=Google+%E6%90%9C%E7%B4%A2&meta=cr%3DcountryCN&aq=f&oq=',
      'Google',
    ],
    [
      'http://www.yandex.com/yandsearch?text=%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%B0+%D1%80%D0%B0%D1%81%D0%BF%D0%B0%D0%B4%D0%B0+%D1%81%D1%82%D0%B5%D0%BA%D0%BB%D0%B0&stpar2=%2Fh1%2Ftm11%2Fs1&stpar4=%2Fs1&stpar1=%2Fu0%27,%20%27%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%B0+%D1%80%D0%B0%D1%81%D0%BF%D0%B0%D0%B4%D0%B0+%D1%81%D1%82%D0%B5%D0%BA%D0%BB%D0%B0',
      'Yandex',
    ],
    ['http://www.yandex.ru/yandsearch?text=%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B7%D0%B4%D1%80%D0%B0%D0%B2', 'Yandex'],
    [
      'http://www.google.ge/search?hl=en&q=%E1%83%A1%E1%83%90%E1%83%A5%E1%83%90%E1%83%A0%E1%83%97%E1%83%95%E1%83%94%E1%83%9A%E1%83%9D&btnG=Google+Search',
      'Google',
    ],
    [
      'http://go.mail.ru/search?rch=e&q=%D0%B3%D0%BB%D1%83%D0%B1%D0%BE%D0%BA%D0%B8%D0%B5+%D0%BC%D0%B8%D0%BC%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5+%D0%BC%D0%BE%D1%80%D1%89%D0%B8%D0%BD%D1%8B',
      'Mailru',
    ],
    ['http://go.mail.ru/search?q=%F5%E8%EC%F1%EE%F1%F2%E0%E2%20%F0%E0%F1%F2%EE%F0%EE%EF%F8%E8', 'Mailru'],
    [
      'http://www.google.com/url?sa=t&source=web&ct=res&cd=7&url=http%3A%2F%2Fwww.example.com%2Fmypage.htm&ei=0SjdSa-1N5O8M_qW8dQN&rct=j&q=flowers&usg=AFQjCNHJXSUh7Vw7oubPaO3tZOzz-F-u_w&sig2=X8uCFh6IoPtnwmvGMULQfw',
      'Google',
    ],
    ['http://www.google.com/webhp?tab=mw#hl=en&source=hp&q=test+hash&btnG=Google+Search&aq=f&aqi=&aql=&oq=&fp=22b4dcbb1403dc0f', 'Google'],
    ['http://www.google.com/#hl=en&source=hp&q=test+hash&aq=f&aqi=n1g5g-s1g1g-s1g2&aql=&oq=&fp=22b4dcbb1403dc0f', 'Google'],
    [
      'http://www.google.com/imgres?imgurl=http://www.imagedomain.com/zoom/34782_ZOOM.jpg&imgrefurl=http://www.mydomain.com/product/Omala-Govindra-Tank-XS-Brown-and-Chile.html&usg=__BD6z_JrJRAFjScDRhj4Tp8Vm_Zo=&h=610&w=465&sz=248&hl=en&start=3&itbs=1&tbnid=aiNVNce9-ZYAPM:&tbnh=136&tbnw=104&prev=/images%3Fq%3DFull%2BSupport%2BTummy%26hl%3Den%26safe%3Doff%26sa%3DG%26gbv%3D2%26tbs%3Disch:1',
      'Google Images',
    ],
    [
      'http://www.google.com/imgres?imgurl=http://www.piwik-connector.com/en/wp-content/themes/analytics/images/piwik-connector.png&imgrefurl=http://www.piwik-connector.com/en/&usg=__ASwTaKUfneQEPcSMyGHp6PslPRo=&h=700&w=900&sz=40&hl=en&start=0&zoom=1&tbnid=K7nGMPzsg3iTHM:&tbnh=131&tbnw=168&ei=r9OpTc1lh96BB4bAgOsI&prev=/images%3Fq%3Dpiwik%26hl%3Den%26safe%3Doff%26biw%3D1280%26bih%3D828%26gbv%3D2%26tbm%3Disch&itbs=1&iact=rc&dur=1400&oei=r9OpTc1lh96BB4bAgOsI&page=1&ndsp=23&ved=1t:429,r:0,s:0&tx=125&ty=88',
      'Google Images',
    ],
    [
      'http://www.google.com/search?tbm=isch&hl=en&source=hp&biw=1280&bih=793&q=piwik&gbv=2&oq=piwik&aq=f&aqi=g5g-s1g4&aql=&gs_sm=e&gs_upl=1526l2065l0l2178l5l4l0l0l0l0l184l371l1.2l3l0',
      'Google Images',
    ],
    [
      'http://www.google.fr/imgres?q=piwik&um=1&hl=fr&client=firefox-a&sa=N&rls=org.mozilla:fr:official&tbm=isch&tbnid=Xmlv3vfl6ost2M:&imgrefurl=http://example.com&docid=sCbh1P0moOANNM&w=500&h=690&ei=3OFpTpjvH4T6sgbosYTiBA&zoom=1&iact=hc&vpx=176&vpy=59&dur=299&hovh=264&hovw=191&tx=108&ty=140&page=1&tbnh=140&tbnw=103&start=0&ndsp=39&ved=1t:429,r:0,s:0&biw=1280&bih=885',
      'Google Images',
    ],
    [
      'http://www.google.fr/webhp?hl=fr&tab=ww#hl=fr&gs_nf=1&pq=dahab%20securite&cp=5&gs_id=2g&xhr=t&q=dahab&pf=p&sclient=tablet-gws&safe=off&tbo=d&site=webhp&oq=dahab&gs_l=&pbx=1&bav=on.2,or.r_gc.r_pw.&fp=f8f370e996c0cd5f&biw=768&bih=928&bs=1',
      'Google',
    ],
    [
      'http://www.google.com/cse?cx=006944612449134755049%3Ahq5up-97k4u&cof=FORID%3A10&q=piwik&ad=w9&num=10&rurl=http%3A%2F%2Fwww.homepagle.com%2Fsearch.php%3Fcx%3D006944612449134755049%253Ahq5up-97k4u%26cof%3DFORID%253A10%26q%3D89',
      'Google Custom Search',
    ],
    [
      'http://www.google.com/cse?cx=012634963936527368460%3Aqdoghy8xaco&cof=FORID%3A11%3BNB%3A1&ie=UTF-8&query=geoip&form_id=google_cse_searchbox_form&sa=Search&ad=w9&num=10&rurl=http%3A%2F%2Fpiwik.org%2Fsearch%2F%3Fcx%3D012634963936527368460%253Aqdoghy8xaco%26cof%3DFORID%253A11%253BNB%253A1%26ie%3DUTF-8%26query%3Dgeoip%26form_id%3Dgoogle_cse_searchbox_form%26sa%3DSearch',
      'Google Custom Search',
    ],
    [
      'http://www.google.com.hk/custom?cx=012634963936527368460%3Aqdoghy8xaco&cof=AH%3Aleft%3BCX%3APiwik%252Eorg%3BDIV%3A%23cccccc%3BFORID%3A11%3BL%3Ahttp%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Fcustom_search_logo_sm.gif%3BLH%3A30%3BLP%3A1%3BVLC%3A%23551a8b%3B&ie=UTF-8&query=mysqli.so&form_id=google_cse_searchbox_form&sa=Search&ad=w9&num=10&adkw=AELymgUTLKONpMqPGM-LbgTWRFfzo9uEj92nMyhi08lOA-wvJ9odphte3hfn5Nz13067or397hodwjlupE3ziTpE1uCKhvuTfzH8e8OHp_IAz7YoBQU6YvuSD-YiwcdcfrGRLxrLPUI3&hl=en&oe=UTF-8&client=google-coop-np&boostcse=0&rurl=http://piwik.org/search/%3Fcx%3D012634963936527368460%253Aqdoghy8xaco%26cof%3DFORID%253A11%253BNB%253A1%26ie%3DUTF-8%26query%3Dmysqli.so%26form_id%3Dgoogle_cse_searchbox_form%26sa%3DSearch',
      'Google Custom Search',
    ],
    [
      'http://www.cathoogle.com/results?cx=partner-pub-6379407697620666%3Alil1v7i1hv0&cof=FORID%3A9&safe=active&q=i+love+piwik&sa=Cathoogle+Search&siteurl=www.cathoogle.com%2F#867',
      'Google Custom Search',
    ],
    [
      'http://www.google.ca/search?hl=en&as_q=web+analytics&as_epq=real+time&as_oq=gpl+open+source&as_eq=oracle&num=10&lr=&as_filetype=&ft=i&as_sitesearch=&as_qdr=all&as_rights=&as_occt=any&cr=&as_nlo=&as_nhi=&safe=images',
      'Google',
    ],
    [
      'http://www.google.ca/search?as_q=web+analytics&as_epq=real+time&as_oq=gpl+open+source&as_eq=oracle&num=10&lr=&as_filetype=&ft=i&as_sitesearch=&as_qdr=all&as_rights=&as_occt=any&cr=&as_nlo=&as_nhi=&safe=images',
      'Google',
    ],
    [
      'http://www.google.ca/url?sa=t&source=web&cd=1&ved=0CBQQFjAA&url=http%3A%2F%2Fwww.robocoder.ca%2F&rct=j&q=web%20analytics%20gpl%20OR%20open%20OR%20source%20%22real%20time%22%20-sco&ei=zv6KTILkGsG88gaxoqz9Cw&usg=AFQjCNEv2Mp3ruU8YCMI40Pqo9ijjXvsUA',
      'Google',
    ],
    [
      'http://www.google.com/imgres?imgurl=http://www.softwaredevelopment.ca/software/wxtest-red.png&imgrefurl=http://www.softwaredevelopment.ca/wxtestrunner.shtml&usg=__feDWUbLINOfWzPieVKX1iN9uj3A=&h=432&w=615&sz=18&hl=en&start=0&zoom=1&tbnid=V8LgKlxE4zAJnM:&tbnh=143&tbnw=204&ei=w9apTdWzKoLEgQff27X9CA&prev=/images%3Fq%3Dbook%2Bsite:softwaredevelopment.ca%26um%3D1%26hl%3Den%26safe%3Doff%26client%3Dubuntu%26channel%3Dfs%26biw%3D1280%26bih%3D828%26as_st%3Dy%26tbm%3Disch&um=1&itbs=1&iact=hc&vpx=136&vpy=141&dur=19894&hovh=188&hovw=268&tx=124&ty=103&oei=w9apTdWzKoLEgQff27X9CA&page=1&ndsp=3&ved=1t:429,r:0,s:0',
      'Google Images',
    ],
    ['http://www.google.com/search?q=cameras&tbm=shop&hl=en&aq=f', 'Google Shopping'],
    [
      'http://webcache.googleusercontent.com/search?q=cache:CD2SncROLs4J:piwik.org/blog/2010/04/piwik-0-6-security-advisory/+piwik+security&cd=1&hl=en&ct=clnk',
      'Google',
    ],
    [
      'https://www.google.com/search?tbm=vid&hl=de&source=hp&biw=1920&bih=1099&q=piwik&gbv=2&oq=piwik&gs_l=video-hp.3..0l5.2388.2959.0.3120.5.4.0.1.1.0.72.230.4.4.0....0...1ac.1.24.video-hp..0.5.243.6qReggj7ElY',
      'Google Video',
    ],
    ['http://ca.bing.com/search?q=piwik+web+analytics&go=&form=QBLH&filt=all&qs=n&sk=', 'Bing'],
    ['http://ca.bing.com/images/search?q=anthon+pang&go=&form=QBIR&qs=n&sk=&sc=3-7', 'Bing Images'],
    ['http://cc.bingj.com/cache.aspx?q=web+analytics&d=5020318678516316&mkt=en-CA&setlang=en-CA&w=6ea8ea88,ff6c44df', 'Bing'],
    ['http://m.bing.com/search/search.aspx?Q=piwik&d=&dl=&pq=&a=results&MID=8015', 'Bing'],
    ['http://www.bing.com/images/search?q=piwik&go=&form=QBIL', 'Bing Images'],
    ['http://search.yahoo.com/search/dir?ei=UTF-8&p=analytics&h=c', 'Yahoo! Directory'],
    ['http://www.infospace.com/search/web?fcoid=417&fcop=topnav&fpid=27&q=piwik&ql=', 'InfoSpace'],
    ['http://www.metacrawler.com/info.metac.test.b8/search/web?fcoid=417&fcop=topnav&fpid=27&q=real+time+web+analytics', 'InfoSpace'],
    [
      'http://search.nation.com/pemonitorhosted/ws/results/Web/mobile analytics/1/417/TopNavigation/Source/iq=true/zoom=off/_iceUrlFlag=7?_IceUrl=true',
      'InfoSpace',
    ],
    [
      'http://wsdsold.infospace.com/pemonitorhosted/ws/results/Web/piwik/1/417/TopNavigation/Source/iq=true/zoom=off/_iceUrlFlag=7?_IceUrl=true',
      'InfoSpace',
    ],
    ['http://www.123people.de/s/piwik', '123people'],
    [
      'http://msxml.excite.com/excite/ws/results/Images/test/1/408/TopNavigation/Relevance/iq=true/zoom=off/_iceUrlFlag=7?_IceUrl=true&padv=qall%3dpiwik%26qphrase%3d%26qany%3d%26qnot%3d',
      'Excite',
    ],
    ['http://search.mywebsearch.com/mywebsearch/GGmain.jhtml?searchFor=piwik&tpr=sbt&st=site&ptnrS=ZZ&ss=sub&gcht=', 'MyWebSearch'],
    ['http://us.yhs4.search.yahoo.com/yhs/search;_ylt=A0oG7qCW9ZhNdFQAuTQPxQt.?q=piwik', 'Yahoo!'],
    ['http://us.nc.yhs.search.yahoo.com/if?p=piwik&partnerid=yhs-if-timewarner&fr=yhs-if-timewarner&ei=UTF-8&YST_b=7&vm=p', 'Yahoo!'],
    ['http://de.images.search.yahoo.com/search/images;_ylt=A0PDode7bWpSCSIAgtM0CQx.?p=piwik&ei=utf-8&iscqry=&fr=sfp', 'Yahoo! Images'],
    ['http://search.babylon.com/?q=piwik', 'Babylon'],
    ['http://search.babylon.com/web/piwik', 'Babylon'],
    ['http://images.de.ask.com/fr?q=piwik&qt=0', 'Ask'],
    ['http://www.baidu.com/?wd=test1', 'Baidu'],
    ['http://tieba.baidu.com/?kw=test2', 'Baidu'],
    ['http://web.gougou.com/?search=test3', 'Baidu'],
    ['http://search.naver.com/search.naver?where=nexearch&query=FAU+&x=0&y=0&sm=top_hty&fbm=1&ie=utf8', 'Naver'],
    [
      'http://search.naver.com/search.naver?where=nexearch&query=++%EA%B2%80%EC%83%89+++%EC%A7%88%EB%AC%B8%ED%98%95+%EA%B2%80%EC%83%89%EC%96%B4+%EA%B2%B0%ED%98%BC+%ED%9B%84+%EA%B1%B1%EC%A0%95+1%EC%9C%84&sm=top_hty&fbm=1&ie=utf8',
      'Naver',
    ],
    [
      'http://search.nate.com/search/all.html?thr=sbus&q=%B0%CB%BB%F6+++%C1%FA%B9%AE%C7%FC+%B0%CB%BB%F6%BE%EE+%B0%E1%C8%A5+%C8%C4+%B0%C6%C1%A4+1%C0%A7',
      'Nate',
    ],
    [
      'http://search.daum.net/search?w=tot&DA=UMEF&t__nil_searchbox=suggest&sug=&q=%EA%B2%80%EC%83%89+++%EC%A7%88%EB%AC%B8%ED%98%95+%EA%B2%80%EC%83%89%EC%96%B4+%EA%B2%B0%ED%98%BC+%ED%9B%84+%EA%B1%B1%EC%A0%95+1%EC%9C%84',
      'Daum',
    ],
    [
      'http://images.search.conduit.com/ImagePreview/?q=test+5&ctid=CT2431245&SearchSource=13&PageSource=HomePage&start=105&pos=33',
      'Conduit.com',
    ],
    ['http://suche.web.de/web?origin=HP&q=test+5&jsenabled=true', 'Web.de'],
    [
      'http://avira-int.ask.com/web?q=piwik&gct=serp&qsrc=0&o=APN10261&l=dis&locale=de_DE&qid=E17EE997A2AD0B90FF6771B4873C379E&frstpgo=0&page=2&jss=1',
      'Ask',
    ],
    ['http://de.wow.com/search?s_pt=aolsem&s_it=aolsem&s_chn=7&q=piwik%20analytics', 'Google'],
    ['http://search.snap.do/?q=piwik&category=Web', 'Snap.do'],
    ['http://www.benefind.de/web.php?q=piwik', 'Yahoo!'],
    ['http://www.talimba.com/index.php?page=search/web&search=piwik&type=Web&fl=0', 'talimba'],
    ['http://www.searchmobileonline.com/search?q=searchterm', 'InfoSpace'],
    ['http://search.leonardo.it/?q=searchterm', 'Google'],
    [
      'http://image.search.yahoo.co.jp/search?ei=UTF-8&fr=top_ga1_sa&p=%EF%BD%94%EF%BD%8F+%EF%BD%88%EF%BD%85%EF%BD%81%EF%BD%92%EF%BD%94+%EF%BD%8C%EF%BD%8F%EF%BD%87%EF%BD%8F',
      'Yahoo! Japan Images',
    ],
    ['http://image.search.yahoo.co.jp/search?ei=Shift_JIS&fr=top_ga1_sa&p=%8CN%82%CC%96%BC%82%CD%81B', 'Yahoo! Japan Images'],
    ['http://image.search.yahoo.co.jp/search?ei=EUC-JP&fr=top_ga1_sa&p=%B7%AF%A4%CE%CC%BE%A4%CF%A1%A3', 'Yahoo! Japan Images'],
    [
      'http://video.search.yahoo.co.jp/search?tt=c&ei=UTF-8&fr=sfp_as&aq=-1&oq=&p=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82&meta=vc%3D',
      'Yahoo! Japan Videos',
    ],
    [
      'http://video.search.yahoo.co.jp/search?tt=c&ei=Shift_JIS&fr=sfp_as&aq=-1&oq=&p=%8El%8C%8E%82%CD%8CN%82%CC%89R&meta=vc%3D',
      'Yahoo! Japan Videos',
    ],
    [
      'http://video.search.yahoo.co.jp/search?tt=c&ei=EUC-JP&fr=sfp_as&aq=-1&oq=&p=%BB%CD%B7%EE%A4%CF%B7%AF%A4%CE%B1%B3&meta=vc%3D',
      'Yahoo! Japan Videos',
    ],
    ['http://search.yahoo.co.jp/search?ei=UTF-8&p=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82', 'Yahoo! Japan'],
    ['http://search.yahoo.co.jp/search?ei=Shift_JIS&p=%8El%8C%8E%82%CD%8CN%82%CC%89R', 'Yahoo! Japan'],
    ['http://search.yahoo.co.jp/search?ei=EUC-JP&p=%BB%CD%B7%EE%A4%CF%B7%AF%A4%CE%B1%B3', 'Yahoo! Japan'],
    ['http://search.auone.jp/?q=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82&sr=0001&ie=UTF-8&lr=', 'auone'],
    ['http://search.auone.jp/?q=%8El%8C%8E%82%CD%8CN%82%CC%89R&sr=0001&ie=SJIS&lr=', 'auone'],
    ['http://search.auone.jp/?q=%BB%CD%B7%EE%A4%CF%B7%AF%A4%CE%B1%B3&sr=0001&ie=EUC&lr=', 'auone'],
    ['http://search.nifty.com/websearch/search?select=2&ss=up&Text=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82', 'Nifty'],
    ['http://videosearch.nifty.com/search?kw=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82', 'Nifty Videos'],
    [
      'http://www.claro-search.com/?q=logiciels+pour+%C3%A9crire+en+japonais+avec+windows+xp&s=web&as=0&rlz=0&babsrc=SP_clro',
      'Claro Search',
    ],
    [
      'http://search.smt.docomo.ne.jp/result?MT=%E3%83%AC%E3%82%B9%E3%82%AD%E3%83%A5%E3%83%BCme+ova&SID=s08&SPAGE=1&UNIT=11&IND=000&PAGE=2&URANK=11&TPLID=01',
      'Google',
    ],
    [
      'http://image.search.smt.docomo.ne.jp/image_detail.php?FR=189&MT=%E3%81%B5%E3%81%9F%E3%82%8A%E3%81%AF%E3%83%97%E3%83%AA%E3%82%AD%E3%83%A5%E3%82%A2MaxHeart&RS=21&PT=000',
      'Google',
    ],
    ['http://cgi.search.biglobe.ne.jp/cgi-bin/search-st?q=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82&ie=utf8', 'Biglobe'],
    ['http://cgi.search.biglobe.ne.jp/cgi-bin/search-st?q=%8El%8C%8E%82%CD%8CN%82%CC%89R&ie=sjis', 'Biglobe'],
    ['http://cgi.search.biglobe.ne.jp/cgi-bin/search-st?q=%BB%CD%B7%EE%A4%CF%B7%AF%A4%CE%B1%B3&ie=euc', 'Biglobe'],
    ['http://images.search.biglobe.ne.jp/cgi-bin/search?q=%E3%82%B5%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%AF%EF%BC%88', 'Biglobe Images'],
    ['http://www.so-net.ne.jp/search/web/?query=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82&from=gp&kz=&suggest=gp_suggest_on', 'So-net'],
    ['http://video.so-net.ne.jp/search/?kw=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82&from=', 'So-net Videos'],
    ['http://search.seesaa.jp/%E6%97%A5%E6%9C%AC%E3%83%86%E3%83%AC%E3%83%93%E6%94%BE%E9%80%81%E7%B6%B2/index.html', 'SeeSaa'],
    ['http://en.toppreise.ch/index.php?search=w%FCrzpr%E4nft%DF&sRes=OK', 'Toppreise.ch'],
    ['http://chercherfr.aguea.com/s.py?q=piwik', 'Aguea'],
    ['http://www.lookany.com/search/piwik+guide', 'LookAny'],
    ['http://www.lookany.com/images/piwik+guide', 'LookAny'],
    ['http://search.tb.ask.com/search/GGmain.jhtml?searchfor=Drinkable+sunscreen&tpr=tt-pop-h&n=&st=hp&qs=', 'Ask'],
    ['http://search.smartaddressbar.com/web.php?s=habillage+aikatsu', 'SmartAddressbar'],
    ['http://www.woopie.jp/search?kw=piwik&return=authorization&res=fail&code=213', 'Woopie'],
    ['http://lemoteur.ke.voila.fr/?module=orange&bhv=images&kw=negi%20ma%20ala%20alba%20eva', 'Orange'],
    ['http://search.v9.com/image/?q=saeko&hl=mx&yahoo=0&pn=2&ab=default', 'InfoSpace'],
    ['http://www.k9safesearch.com/search.jsp?q=amagami+sae+nakata', 'K9 Safe Search'],
    [
      'http://sp-image.search.auone.jp/search?q=school%20days%20%E7%94%BB%E5%83%8F&query=p2Abo29fVTEurKZt55F75LBCWzygLJqypj&page=6',
      'auone Images',
    ],
    ['http://search.iminent.com/SearchTheWeb/v6/1036/homepage/Default.aspx#q=rest&s=images', 'InfoSpace'],
    ['http://www.sputnik.ru/search?q=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE', 'Sputnik'],
    [
      'http://yandex.ru/clck/jsredir?from=yandex.ru;yandsearch;web;;&text=&etext=385.4_2Hh6u_q9NEfpXpGpdVughcGncWYG-_kwHJA-7QxQ8v4xvt5Q2aAB7TvvUxHLtacHMltCoYGQFFmIdiXaIT-_yiHqjEJoZKVdHIXJylYsQ5TJuxRtqCDA0zUi_xlatVD6kx219rIP4Q4a7j9E7-2U88ZpCZwGXuhRws6LASTZUIJRfiPbVdxjIn2Qu5bCtcGKIQBqGa567Czx019cxaPvNAWQQ_8MIJjUgFHzg2vO_XvlSMmKOcooZNX5UzqgJAnaioMW7884jsYEKwXebrij39unXyWKnLXDX15607fkXqQFGIC_tp8zvjXq0ynizqcdQcfkHnZG-zxxPqCoALAWj47hwRCZtLGinfqMatmzFWG7Yo7eWxScEHyMI2J89OU2ZjpuHog0VyZpSb3hN17-CdHWEeN_ii1mLG_J24ftGMEpbWOeH-M3fZeAtCzmq0XUFchFAbVvm9Xmk8I2M-4A.66cd118e1c9292f7ec030c8580f6912eae4ac700&uuid=&state=AiuY0DBWFJ4ePaEse6rgeAjgs2pI3DW99KUdgowt9XsGes-COYeAtjuEaMUoBSHP2gxXC4630Mz4aEvXYUCXRTGAgAQwM7IGD-gsizkhSmBNCEfle91ZI3guOwMFOli3aeHzkqoQeuyYhvz_XwXodFz8gB8yMp6IgAL52sHwR5edKVNpZtbPIFNbLDRYIxJbYQciYGnLnCw_i584OfCtQO-zjBBGMlwoQFtGet-Xvmw&data=UlNrNmk5WktYejR0eWJFYk1LdmtxdE5aS05CUWU0alhkSkF1MEpOb0Jrc0dpbmNsUGhaVjljRWt6R0VackFURk5sM1psNlVKMWh6djhYazhRT1psQTdHamFGSFJacDFhQjdfbHJQU05jeDJMRHV0MTJmRG53Zw&b64e=2&sign=9072743a841f27dd5e766c4b57fa5138&keyno=0&l10n=ru',
      'Yandex',
    ],
    [
      'http://r.search.yahoo.com/_ylt=A9mSs2YFMt1ThykAAaOA3YlQ;_ylu=X3oDMTBydWpobjZlBHNlYwNzcgRwb3MDMQRjb2xvA2lyMgR2dGlkAw--/RV=2/RE=1407033989/RO=10/RU=http://www.something.com//RK=0/RS=YOw3nEcdnM8kysqLyl4DzpAHnDo-',
      'Yahoo!',
    ],
    ['https://search.disconnect.me/searchTerms/serp?search=da616d2a-c376-4469-84be-8f38e4573e32', 'DisconnectSearch'],
    ['https://ixquick.com/do/asearch', 'IxQuick'],
    ['http://duckduckgo.com/post.html', 'DuckDuckGo'],
    [
      'http://www.google.com/imgres?hl=en&client=ubuntu&hs=xDb&sa=X&channel=fs&biw=1920&bih=1084&tbm=isch&prmd=imvns&tbnid=5i7iz7u4LPSSrM:&imgrefurl=http://helloworld/trac/wiki/HowToSetupDevelopmentEnvironmentWindows&docid=tWN9OesMyOTqsM&imgurl=http://helloworld.org/trac/raw-attachment/wiki/HowToSetupDevelopmentEnvironmentWindows/eclipse-preview.jpg&w=1000&h=627&ei=pURoT67BEdT74QTUzYiSCQ&zoom=1&iact=hc&vpx=1379&vpy=548&dur=513&hovh=178&hovw=284&tx=134&ty=105&sig=108396332168858896950&page=1&tbnh=142&tbnw=227&start=0&ndsp=37&ved=1t:429,r:5,s:0',
      'Google Images',
    ],
    [
      'http://www.google.fr/imgres?hl=en&biw=1680&bih=925&gbv=2&tbm=isch&tbnid=kBma1eg8aVOKoM:&imgrefurl=http://www.squido.com/research-keywords&docid=YSY3GQh3O8dkjM&imgurl=http://i3.squidocdn.com/resize/squidoo_images/590/draft_lens10233921module148408128photo_1298307262Research_keywords_6.jpg&w=590&h=412&ei=_OVZT4_3EInQ8gOWuqXbDg&zoom=1&iact=hc&vpx=164&vpy=205&dur=33&hovh=188&hovw=269&tx=137&ty=89&sig=113944581904793140725&page=1&tbnh=109&tbnw=156&start=0&ndsp=42&ved=1t:429,r:0,s:0www.google.fr/imgres?hl=en&biw=1680&bih=925&gbv=2&tbm=isch&tbnid=kBma1eg8aVOKoM:&imgrefurl=http://www.squido.com/research-keywords&docid=YSY3GQh3O8dkjM&imgurl=http://i3.squidocdn.com/resize/squidoo_images/590/draft_lens10233921module148408128photo_1298307262Research_keywords_6.jpg&w=590&h=412&ei=_OVZT4_3EInQ8gOWuqXbDg&zoom=1&iact=hc&vpx=164&vpy=205&dur=33&hovh=188&hovw=269&tx=137&ty=89&sig=113944581904793140725&page=1&tbnh=109&tbnw=156&start=0&ndsp=42&ved=1t:429,r:0,s:0',
      'Google Images',
    ],
    ['http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CC&url=http%3A%2F%2Fpiwik.org%2F&ei=&usg=', 'Google'],
    ['https://www.google.com/', 'Google'],
    ['https://www.google.co.uk/', 'Google'],
    ['https://www.google.co.uk', 'Google'],
    [
      'http://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-x&output=html&h=15&slotname=2973049897&adk=3777420323&w=728&lmt=1381755030&flash=11.9.900.117&url=http%3A%2F%2Fexample.com%2F&dt=1381755030169&bpp=8&bdt=2592&shv=r20131008&cbv=r20130906&saldr=sa&correlator=1381755030200&frm=20&ga_vid=1659309719.1381755030&ga_sid=1381755030&ga_hid=1569070879&ga_fc=0&u_tz=660&u_his=3&u_java=1&u_h=768&u_w=1366&u_ah=728&u_aw=1366&u_cd=24&u_nplug=0&u_nmime=0&dff=times%20new%20roman&dfs=13&adx=311&ady=107&biw=1349&bih=673&oid=2&ref=http%3A%2F%2Fwww.google.com.au%2Furl%3Fsa%3Dt%26rct%3Dj%26q%3D%26esrc%3Ds%26frm%3D1%26source%3Dweb%26cd%3D10%26ved%3D0CGcQFjAJ%26url%3Dhttp%253A%252F%252Fexample.com%252F%26ei%3DXNtbUvrJPKXOiAfw1IH4Bw%26usg%3DAFQjCNE66zRf2zaUw8FKf0JWxiM1FiXHVg&vis=1&fu=0&ifi=1&pfi=32&dtd=122&xpc=tBekiCZTWM&p=http%3A//example.com&rl_rc=true&adsense_enabled=true&ad_type=text_image&oe=utf8&height=15&width=728&format=fp_al_lp&kw_type=radlink&prev_fmts=728x15_0ads_al&rt=ChBSW-iYAADltAqmmOfZAA2SEg1BbmltYXRlZCBUZXh0Ggj019wBciBqgSgBUhMI8OHhzq6WugIVhJOmCh2NYQBO&hl=en&kw0=Animated+Text&kw1=Animated+GIF&kw2=Animated+Graphics&kw3=Fonts&okw=Animated+Text',
      false,
    ],
    ['https://www.looksmart.com', 'Looksmart'],
    ['https://www.x-recherche.com', 'X-Recherche'],
  ])('should find engine and keywords for %s', (url, engine) => {
    // Act
    const result = SearchEngineDetection(parseUrl(url));

    // Assert
    expect(result).toEqual(engine);
  });
});
