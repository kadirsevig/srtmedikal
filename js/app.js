(function () {
  const data = window.SRT;
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");
  const menu = document.querySelector(".menu");

  const films = [
    {
      id: "online",
      kicker: "Online",
      title: "Bağlı laboratuvar hattı",
      src: "media/online-hat.mp4",
      note: "Kimya ve immünoassay modüllerinin aynı hatta çalıştığı online düzen.",
    },
    {
      id: "offline",
      kicker: "Offline",
      title: "Bağımsız kimya sistemi",
      src: "media/offline-kimya.mp4",
      note: "Tek başına çalışan Mindray BS kimya analizörleri.",
    },
    {
      id: "hat",
      kicker: "Preanalitik",
      title: "Hücre analiz hattı",
      src: "media/cal8000.mp4",
      note: "CAL hücre hattı, slayt hazırlama ve morfoloji akışı.",
    },
    {
      id: "hba",
      kicker: "HbA1c",
      title: "Tam kan HbA1c",
      src: "media/hba1c.mp4",
      note: "H-120 üzerinden HbA1c iş akışı.",
    },
    {
      id: "gaz",
      kicker: "Kan gazı",
      title: "Kritik bakım analizörü",
      src: "media/kangaz-plus.mp4",
      note: "Yoğun bakım kan gazı platformunun tanıtım filmi.",
    },
    {
      id: "hormon",
      kicker: "Hormon",
      title: "Kemilüminesans",
      src: "media/cl8000.mp4",
      note: "CL-8000i immünoassay sistemi.",
    },
  ];

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function cats() {
    return data.categories;
  }

  function catById(id) {
    return cats().find(function (cat) { return cat.id === id; });
  }

  function findDevice(catId, id) {
    const cat = catById(catId);
    if (!cat) return null;
    const item = cat.items.find(function (entry) { return entry.id === id && !entry.linkCat; });
    return item ? { cat: cat, item: item } : null;
  }

  function count(cat) {
    return cat.items.filter(function (item) { return !item.linkCat; }).length +
      (cat.id === "hba1c" ? cat.items.filter(function (item) { return item.linkCat; }).length : 0);
  }

  function ownCount(cat) {
    if (cat.id === "hba1c") return cat.items.length;
    return cat.items.length;
  }

  function shot(item) {
    if (!item.local) {
      return '<div class="ph">' + esc(item.name) + "</div>";
    }
    return '<img src="' + esc(item.local) + '" alt="' + esc(item.name) + '" />';
  }

  function card(cat, item) {
    const target = item.linkCat || cat.id;
    return (
      '<a class="card" href="#/cihaz/' + esc(target) + "/" + esc(item.id) + '">' +
        '<div class="shot">' + shot(item) + "</div>" +
        '<div class="meta"><small>' + esc(item.brand || cat.brand) + "</small>" +
        "<h3>" + esc(item.name) + "</h3><p>" + esc(item.meta) + "</p></div></a>"
    );
  }

  function preview(cat) {
    const item = cat.items.find(function (entry) { return entry.local; }) || cat.items[0];
    return shot(item);
  }

  function setNav(key) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      link.classList.toggle("is-on", link.dataset.nav === key);
    });
  }

  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }

  function fold(cat, index, open) {
    const n = String(index + 1).padStart(2, "0");
    return (
      '<section class="fold' + (open ? " is-open" : "") + '" data-fold="' + esc(cat.id) + '">' +
        '<button type="button" class="fold-head" aria-expanded="' + (open ? "true" : "false") + '">' +
          '<span class="no">' + n + "</span>" +
          '<span class="fold-name">' + esc(cat.title) + "</span>" +
          '<span class="fold-count">' + cat.items.length + " cihaz</span>" +
          '<span class="chev" aria-hidden="true"></span>' +
        "</button>" +
        '<div class="fold-body"><div class="grid">' +
          cat.items.map(function (item) { return card(cat, item); }).join("") +
        "</div></div>" +
      "</section>"
    );
  }

  function folds(openId, query) {
    const q = (query || "").trim().toLocaleLowerCase("tr");
    return cats().map(function (cat, index) {
      const items = cat.items.filter(function (item) {
        if (!q) return true;
        return (item.name + " " + item.meta + " " + cat.title).toLocaleLowerCase("tr").includes(q);
      });
      if (!items.length) return "";
      const viewCat = Object.assign({}, cat, { items: items });
      const open = Boolean(q) || cat.id === openId;
      return fold(viewCat, index, open);
    }).join("");
  }

  function home() {

    const featured = [
      ["biyokimya", "bs-2800m"],
      ["hormon", "cl-8000i"],
      ["hemogram", "bc-6000"],
      ["koagulasyon", "sf-8300"],
      ["kangazi", "kangaz-plus"],
      ["hba1c", "h-120"],
    ].map(function (pair) {
      const found = findDevice(pair[0], pair[1]);
      return found ? card(found.cat, found.item) : "";
    }).join("");

    return (
      '<section class="hero">' +
        '<video autoplay muted loop playsinline poster="media/sal9000.jpg">' +
          '<source src="media/online-hat.mp4" type="video/mp4" />' +
        "</video>" +
        '<div class="hero-shade"></div>' +
        '<div class="hero-copy">' +
          '<p class="kicker"><i></i>SRT Medikal</p>' +
          "<h1>Klinik<br />laboratuvar<br />çözümleri.</h1>" +
          "<p>Biyokimya, hormon, hemogram, HbA1c, koagülasyon, kan gazı ve idrar analizi. Kurduğumuz cihazlar ve çalıştığımız hatlar.</p>" +
          '<div class="hero-actions">' +
            '<a class="btn btn-red" href="#/cozumler">Cihazları gör</a>' +
            '<a class="btn btn-ghost" href="#/sistemler">Online ve offline hatlar</a>' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section"><div class="wrap">' +
        '<p class="kicker"><i></i>Portföy</p>' +
        "<h2>Yedi başlık, tek kurulum ekibi.</h2>" +
        '<p class="lede">Başlığa basınca o grubun cihazları açılır. Karttan modele girilir.</p>' +
        '<div class="folds">' + folds("") + "</div>" +
      "</div></section>" +
      '<section class="section" style="padding-top:0"><div class="wrap">' +
        '<p class="kicker"><i></i>Film</p>' +
        "<h2>Hatlar hareket halinde.</h2>" +
        theater(films[0].id) +
      "</div></section>" +
      '<section class="section" style="padding-top:0"><div class="wrap">' +
        '<div class="spot-head"><div><p class="kicker"><i></i>Seçilen modeller</p><h2>Öne çıkan cihazlar.</h2></div>' +
        '<a class="btn btn-line" href="#/cozumler">Tüm katalog</a></div>' +
        '<div class="grid">' + featured + "</div>" +
      "</div></section>" +
      '<section class="band">' +
        '<div class="band-copy">' +
          '<p class="kicker"><i></i>Referanslar</p>' +
          "<h2>Çalıştığımız iller.</h2>" +
          "<p>Türkiye genelinde güvenilir çözüm ortağı olduğumuz kurumlar. Harita ve il listesi referans sayfasında.</p>" +
          '<a class="btn btn-red" href="#/referanslar">Referansları aç</a>' +
        "</div>" +
        '<div class="band-side"><strong>20</strong><span>ilde kurulum ve servis</span></div>' +
      "</section>"
    );
  }

  function theater(activeId) {
    const current = films.find(function (film) { return film.id === activeId; }) || films[0];
    const buttons = films.map(function (film) {
      return (
        '<button type="button" data-film="' + esc(film.id) + '" class="' + (film.id === current.id ? "is-on" : "") + '">' +
          "<small>" + esc(film.kicker) + "</small><b>" + esc(film.title) + "</b></button>"
      );
    }).join("");
    return (
      '<div class="theater" data-theater>' +
        "<figure class=\"stage\">" +
          '<video controls playsinline src="' + esc(current.src) + '"></video>' +
          "<figcaption>" + esc(current.kicker) + " · " + esc(current.note) + "</figcaption>" +
        "</figure>" +
        '<div class="reel">' + buttons + "</div>" +
      "</div>"
    );
  }

  function catalog(query, openId) {
    const q = query || "";
    const blocks = folds(openId || "", q);
    return (
      '<div class="page"><div class="wrap">' +
        '<div class="page-head"><div><p class="kicker"><i></i>Katalog</p><h1>Cihazlar.</h1>' +
        '<p class="lede">Biyokimya, hormon ve diğer başlıklara basınca cihazlar açılır.</p></div></div>' +
        '<input class="search" id="q" type="search" placeholder="Model veya kategori ara" value="' + esc(q) + '" />' +
        '<div class="folds">' + (blocks || '<p class="lede">Bu aramada cihaz yok.</p>') + "</div>" +
      "</div></div>"
    );
  }

  function device(catId, id) {
    const found = findDevice(catId, id);
    if (!found) return missing();
    const item = found.item;
    const cat = found.cat;
    const paragraphs = (item.paragraphs || []).map(function (p) {
      return "<p>" + esc(p) + "</p>";
    }).join("");
    const bullets = (item.bullets || []).map(function (b) {
      return "<li>" + esc(b) + "</li>";
    }).join("");
    const film = item.video
      ? '<div class="film"><video controls playsinline src="' + esc(item.video) + '"></video></div>'
      : "";
    const maker = item.href
      ? '<a class="btn btn-line" href="' + esc(item.href) + '" target="_blank" rel="noopener">Üretici sayfası</a>'
      : "";
    return (
      '<div class="page"><div class="wrap">' +
        '<p class="crumbs"><a href="#/cozumler">Çözümler</a> / <a href="#/kategori/' + esc(cat.id) + '">' + esc(cat.title) + "</a> / " + esc(item.name) + "</p>" +
        '<article class="detail">' +
          '<div class="detail-shot">' + shot(item) + "</div>" +
          "<div>" +
            '<p class="detail-kicker">' + esc(item.brand || cat.brand) + "</p>" +
            "<h1>" + esc(item.name) + "</h1>" +
            '<p class="role">' + esc(item.meta) + "</p>" +
            '<div class="copy">' + paragraphs + "</div>" +
            '<ul class="ticks">' + bullets + "</ul>" +
            '<div class="actions"><a class="btn btn-ink" href="#/kategori/' + esc(cat.id) + '">Kategoriye dön</a>' + maker + "</div>" +
          "</div>" +
        "</article>" + film +
      "</div></div>"
    );
  }

  function systems() {
    return (
      '<div class="page"><div class="wrap">' +
        '<div class="page-head"><div><p class="kicker"><i></i>Sistemler</p><h1>Online, offline, preanalitik.</h1>' +
        '<p class="lede">Aynı laboratuvarın üç hali. Bağımsız analizör, bağlı hat ve numunenin analize girmeden önceki düzeni. Filmler mevcut kayıtlarımız.</p></div></div>' +
        theater("online") +
        '<div class="grid" style="margin-top:28px">' +
          card(catById("biyokimya"), findDevice("biyokimya", "sal-9000").item) +
          card(catById("biyokimya"), findDevice("biyokimya", "bs-600m").item) +
          card(catById("hemogram"), findDevice("hemogram", "cal-8000").item) +
          card(catById("hemogram"), findDevice("hemogram", "sc-120").item) +
        "</div>" +
      "</div></div>"
    );
  }

  const refCities = [
    "Niğde", "Nevşehir", "Adana", "Mersin", "Hatay", "Osmaniye", "Kahramanmaraş",
    "Gaziantep", "Kilis", "Şanlıurfa", "Malatya", "Elazığ", "Kayseri", "Sivas",
    "Tokat", "Yozgat", "Çorum", "Amasya", "Aksaray", "Kırıkkale"
  ];

  function references() {
    const chips = refCities.map(function (city) {
      const home = city === "Gaziantep";
      return '<li class="' + (home ? "is-home" : "") + '">' + esc(city) + (home ? " · merkez" : "") + "</li>";
    }).join("");
    return (
      '<div class="page"><div class="wrap">' +
        '<div class="page-head"><div><p class="kicker"><i></i>Referanslar</p><h1>Referanslarımız.</h1>' +
        '<p class="lede">Türkiye genelinde güvenilir çözüm ortağı olduğumuz kurumlar. Kırmızı iller çalıştığımız yerler.</p></div></div>' +
        '<div class="ref-map">' + (window.SRT_MAP || "") + "</div>" +
        '<ul class="ref-list">' + chips + "</ul>" +
      "</div></div>"
    );
  }

  function about() {
    return (
      '<div class="page"><div class="wrap placeholder">' +
        '<p class="kicker"><i></i>Kurumsal</p>' +
        "<h1>Hakkımızda<br />hazırlanıyor.</h1>" +
        '<p class="lede">Şirket metni, tarihçe ve ekip bu sayfaya sonra eklenecek. Şimdilik cihaz portföyü ve referanslar açık.</p>' +
        '<a class="btn btn-ink" href="#/cozumler">Cihazlara geç</a>' +
      "</div></div>"
    );
  }

  function contact() {
    return (
      '<div class="page"><div class="wrap">' +
        '<div class="page-head"><div><p class="kicker"><i></i>İletişim</p><h1>İletişim.</h1>' +
        '<p class="lede">Bizimle iletişime geçin, size en kısa sürede dönelim.</p></div></div>' +
        '<aside class="contact-card contact-solo">' +
          "<div><h2>Merkez ofis</h2>" +
          "<p>Binevler Mah. Abdulkadir Aksu Blv.<br />Efe Rezidans No:47 AB/1<br />Şahinbey / Gaziantep</p></div>" +
          '<div class="contact-lines">' +
            '<a href="tel:+903423350200">Tel: 0342 335 02 00</a>' +
            '<a href="tel:+903423350212">Faks: 0342 335 02 12</a>' +
            '<a href="mailto:info@srtmedikal.com">info@srtmedikal.com</a>' +
          "</div>" +
        "</aside>" +
        '<div class="map-frame">' +
          '<iframe title="SRT Medikal konumu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3095.495602792782!2d37.378319876269894!3d37.06366045509743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15258d5e7e7e9d1f%3A0xa8c5d97d9f096c8f!2sAbdulkadir%20Aksu%20Blv.%20No%3A47%2C%20Binevler%2C%2027470%20%C5%9Eahinbey%2FGaziantep!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"></iframe>' +
          '<div class="map-meta"><span>Şahinbey / Gaziantep</span><a href="https://maps.google.com/?q=Abdulkadir+Aksu+Blv+No:47+Binevler+Şahinbey+Gaziantep" target="_blank" rel="noopener">Haritada aç</a></div>' +
        "</div>" +
      "</div></div>"
    );
  }

  function missing() {
    return (
      '<div class="page"><div class="wrap placeholder">' +
        "<h1>Sayfa yok.</h1>" +
        '<a class="btn btn-ink" href="#/">Anasayfa</a>' +
      "</div></div>"
    );
  }

  function paint(html, key) {
    view.innerHTML = html;
    setNav(key);
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function route() {
    const parts = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    const head = parts[0] || "";
    if (!head) { paint(home(), "home"); return; }
    if (head === "cozumler") { paint(catalog(""), "cozumler"); return; }
    if (head === "kategori") { paint(catalog("", parts[1]), "cozumler"); return; }
    if (head === "cihaz") { paint(device(parts[1], parts[2]), "cozumler"); return; }
    if (head === "sistemler") { paint(systems(), "sistemler"); return; }
    if (head === "fuarlar" || head === "referanslar") { paint(references(), "referanslar"); return; }
    if (head === "hakkimizda") { paint(about(), "hakkimizda"); return; }
    if (head === "iletisim") { paint(contact(), "iletisim"); return; }
    paint(missing(), "");
  }

  view.addEventListener("click", function (event) {
    const headBtn = event.target.closest(".fold-head");
    if (headBtn) {
      const foldEl = headBtn.closest(".fold");
      const open = foldEl.classList.toggle("is-open");
      headBtn.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    const button = event.target.closest("[data-film]");
    if (!button) return;
    const box = button.closest("[data-theater]");
    if (!box) return;
    box.outerHTML = theater(button.dataset.film);
  });

  view.addEventListener("input", function (event) {
    if (event.target.id !== "q") return;
    const value = event.target.value;
    const start = event.target.selectionStart;
    view.innerHTML = catalog(value);
    const field = document.getElementById("q");
    if (field) {
      field.focus();
      field.setSelectionRange(start, start);
    }
  });

  menu.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeMenu();
  });

  window.addEventListener("hashchange", route);
  if (!location.hash) location.hash = "#/";
  route();
})();
