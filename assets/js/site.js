/* Lega.work site script: shared by every page. Each feature checks that its elements exist. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "en";
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- Language ---------- */
  var msgs = {
    en: { missing: "Please fill in your name, a valid e-mail, a short description and tick the consent box.", ok: "Thank you. The form is not connected yet, so nothing was sent. Please call or e-mail the office directly." },
    bg: { missing: "Моля, попълнете име, валиден имейл, кратко описание и отбележете съгласието.", ok: "Благодарим ви. Формата все още не е свързана и нищо не беше изпратено. Моля, обадете се или пишете директно на кантората." }
  };
  function setLang(l) {
    lang = l;
    document.body.classList.remove("en", "bg");
    document.body.classList.add(l);
    document.documentElement.lang = l;
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); });
    $$("option[data-en]").forEach(function (o) { o.textContent = o.dataset[l]; });
    var st = $("#status"); if (st) st.textContent = "";
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.lang === lang) return;
      if (reduce) { setLang(b.dataset.lang); return; }
      document.body.classList.add("switching");
      setTimeout(function () { setLang(b.dataset.lang); onScroll(); requestAnimationFrame(function () { document.body.classList.remove("switching"); }); }, 230);
    });
  });
  try { var saved = localStorage.getItem("lang"); if (saved === "bg" || saved === "en") setLang(saved); } catch (e) {}

  /* ---------- Hamburger menu ---------- */
  var burger = $("#burger"), menu = $("#menu");
  if (burger && menu) {
    menu.inert = true;
    var open = false;
    function setMenu(on) {
      open = on;
      var r = burger.getBoundingClientRect();
      menu.style.setProperty("--mx", (r.left + r.width / 2) + "px");
      menu.style.setProperty("--my", (r.top + r.height / 2) + "px");
      document.body.classList.toggle("menu-open", on);
      burger.setAttribute("aria-expanded", String(on));
      menu.inert = !on;
      menu.setAttribute("aria-hidden", String(!on));
      if (on) { var first = menu.querySelector(".menu-nav a"); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350); }
      else burger.focus({ preventScroll: true });
    }
    burger.addEventListener("click", function () { setMenu(!open); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && open) setMenu(false); });
    $$(".menu a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var samePage = a.pathname.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "");
        if (samePage && a.hash) {
          e.preventDefault();
          setMenu(false);
          var target = document.querySelector(a.hash);
          setTimeout(function () { if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); history.replaceState(null, "", a.hash); }, 420);
        } else if (samePage && !a.hash) {
          e.preventDefault(); setMenu(false);
          setTimeout(function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }, 420);
        }
      });
    });
  }

  /* ---------- Ticker ---------- */
  var track = $("#track");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Copy buttons ---------- */
  $$(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.dataset.copy);
      var done = function () { var t = btn.innerHTML; btn.textContent = lang === "bg" ? "Копирано" : "Copied"; setTimeout(function () { btn.innerHTML = t; }, 1400); };
      var fallback = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.textContent).then(done, fallback); else fallback();
    });
  });

  /* ---------- Enquiry form ---------- */
  var form = $("#enquiry");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = $("#status");
    var ok = form["f-name"].value.trim() && /\S+@\S+\.\S+/.test(form["f-email"].value) && form["f-msg"].value.trim() && form["f-consent"].checked;
    st.textContent = ok ? msgs[lang].ok : msgs[lang].missing;
  });

  /* ---------- Reveals: only items starting below the fold get the .pre state ---------- */
  var groups = [".side", ".intro", ".prose > p", ".fan", ".principle", ".photo-wrap", ".member-card > :not(.photo-wrap)", ".person > .role", ".person > h3", ".highlights", ".cv > div", ".details .row", "form.enquiry", ".empty", "footer .wrap > div"];
  var items = [];
  groups.forEach(function (sel) {
    var seen = new Map();
    $$(sel).forEach(function (el) {
      var n = seen.get(el.parentNode) || 0; seen.set(el.parentNode, n + 1);
      if (!el.classList.contains("photo-wrap")) el.classList.add("reveal");
      el.style.setProperty("--i", Math.min(n, 5)); items.push(el);
    });
  });
  var cards = $$(".card"), shapes = $$("main .shape"), photos = $$(".photo-wrap"), fan = $("#fan");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.concat(cards, shapes).forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); io.observe(el); }
    });
  }

  /* ---------- Scroll-linked motion ---------- */
  function stickyTop(el) { return parseFloat(getComputedStyle(el).top) || 0; }
  function motion() {
    var vh = innerHeight;
    shapes.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      var off = (r.top + r.height / 2 - vh / 2);
      var sp = parseFloat(el.dataset.speed || 0), rot = parseFloat(el.dataset.rot || 0);
      el.style.transform = "translate3d(0," + (off * sp).toFixed(1) + "px,0) rotate(" + (rot * -off / vh).toFixed(1) + "deg)";
    });
    if (fan) {
      var fr = fan.getBoundingClientRect();
      fan.style.setProperty("--f", clamp((vh - fr.top) / (vh * .7), 0, 1).toFixed(3));
    }
    photos.forEach(function (ph, k) {
      var tr = ph.getBoundingClientRect(), dir = k % 2 ? -1 : 1;
      var tp = clamp((vh - tr.top) / (vh + tr.height), 0, 1);
      var img = ph.querySelector("img"), s1 = ph.querySelector(".s1"), s2 = ph.querySelector(".s2");
      if (img) img.style.setProperty("--py", (-tp * 13).toFixed(2) + "%");
      if (s1) s1.style.transform = "translate(" + (Math.sin(tp * 6) * 14 * dir).toFixed(1) + "px," + (tp * 120 - 40).toFixed(1) + "px) rotate(" + (tp * 140 * dir).toFixed(1) + "deg)";
      if (s2) s2.style.transform = "translateY(" + (-tp * 90 + 30).toFixed(1) + "px) rotate(" + (tp * 180 * dir).toFixed(1) + "deg)";
    });
    var cover = cards.map(function (c, j) {
      if (j === 0) return 0;
      var r = c.getBoundingClientRect(), h = cards[j - 1].offsetHeight || 1;
      return clamp(1 - (r.top - stickyTop(c)) / h, 0, 1);
    });
    cards.forEach(function (c, i) {
      var depth = 0;
      for (var j = i + 1; j < cards.length; j++) depth += cover[j];
      c.style.transform = depth ? "scale(" + Math.max(.8, 1 - depth * .04).toFixed(4) + ")" : "";
      c.style.filter = depth ? "brightness(" + (1 - Math.min(depth, 3) * .06).toFixed(3) + ")" : "";
      c.style.setProperty("--gr", ((vh - c.getBoundingClientRect().top) * .25).toFixed(1) + "deg");
    });
  }

  /* ---------- Hero logo as a balance scale ----------
     The two slanted bars are the beams. They pivot on their centres, the coloured shapes ride on
     the beam ends like pans, and the upright bars follow the joints. */
  (function () {
    var hero = $(".hero"), stage = $("#stage");
    if (!hero || !stage) return;
    var kin = Array.prototype.slice.call(stage.querySelectorAll(".kin"));
    /* layer order: 0 left upright, 1 right upright, 2 lower beam, 3 upper beam, 4 teal, 5 violet, 6 yellow, 7 red */
    var cTop = [187.0, 130.3], cBot = [182.8, 358.4];
    var teal = [85.6, 180.2], red = [288.4, 80.4], yellow = [84.4, 408.0], violet = [281.2, 308.8];
    var R = 180 / Math.PI;
    function rot(p, c, a) { var co = Math.cos(a), si = Math.sin(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * si, c[1] + x * si + y * co]; }
    function f(n) { return n.toFixed(2); }
    function upright(el, p0, q0, p1, q1) {
      var m0 = [(p0[0] + q0[0]) / 2, (p0[1] + q0[1]) / 2], m1 = [(p1[0] + q1[0]) / 2, (p1[1] + q1[1]) / 2];
      var da = (Math.atan2(q1[1] - p1[1], q1[0] - p1[0]) - Math.atan2(q0[1] - p0[1], q0[0] - p0[0])) * R;
      el.setAttribute("transform", "translate(" + f(m1[0] - m0[0]) + " " + f(m1[1] - m0[1]) + ") rotate(" + f(da) + " " + f(m0[0]) + " " + f(m0[1]) + ")");
    }
    function pan(el, p0, p1, sw) {
      el.setAttribute("transform", "translate(" + f(p1[0] - p0[0]) + " " + f(p1[1] - p0[1]) + ") rotate(" + f(sw) + " " + p0[0] + " " + p0[1] + ")");
    }
    function pose(top, bot, sw) {
      var at = top / R, ab = bot / R;
      var nT = rot(teal, cTop, at), nR = rot(red, cTop, at), nY = rot(yellow, cBot, ab), nV = rot(violet, cBot, ab);
      kin[3].setAttribute("transform", "rotate(" + f(top) + " " + cTop[0] + " " + cTop[1] + ")");
      kin[2].setAttribute("transform", "rotate(" + f(bot) + " " + cBot[0] + " " + cBot[1] + ")");
      pan(kin[4], teal, nT, sw); pan(kin[7], red, nR, -sw); pan(kin[6], yellow, nY, -sw * .8); pan(kin[5], violet, nV, sw * .8);
      upright(kin[0], teal, yellow, nT, nY);
      upright(kin[1], red, violet, nR, nV);
    }
    if (reduce) { pose(14, 10, 0); stage.style.transform = "rotateY(-14deg)"; return; }
    /* Two damped springs: one tips both beams (the weighing), one tips them against each other (a twist).
       Beams rest about 27 degrees up to the right, so +27 is level; targets cross level both ways. */
    var a = 0, va = 0, ta = 0, d = 0, vd = 0, td = 0, nextA = 0, nextD = 0, last = 0, tx = 0, px = 0, running = false;
    var weights = [44, 6, 52, 27, -10, 38, 60, 16, 27, -4, 48, 30], wi = 0;
    function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }
    hero.addEventListener("pointermove", function (e) { var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; });
    hero.addEventListener("pointerleave", function () { tx = 0; });
    function frame(now) {
      if (!running) return;
      var t = now / 1000, dt = Math.min(.05, last ? t - last : .016); last = t;
      if (t > nextA) { ta = weights[wi++ % weights.length] + rnd(-5, 5); nextA = t + rnd(1.8, 3.6); }
      if (t > nextD) { td = Math.random() < .35 ? 0 : rnd(-11, 11); nextD = t + rnd(1.2, 2.8); }
      px += (tx - px) * .06;
      var sc = clamp(scrollY / innerHeight, 0, 1);
      var goal = clamp(ta + px * 30 + sc * 26, -16, 66);
      va += ((goal - a) * 6.5 - va * 1.5) * dt; a += va * dt;
      vd += ((td - d) * 9 - vd * 2.2) * dt; d += vd * dt;
      pose(a + d, a - d, clamp(-va * .12, -14, 14));
      stage.style.transform = "rotateX(" + f(6 + Math.sin(t * .4) * 4) + "deg) rotateY(" + f(Math.sin(t * .3) * 14 + px * 16) + "deg) rotateZ(" + f(Math.sin(t * .19) * 4) + "deg)";
      requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { if (en[0].isIntersecting) start(); else running = false; }).observe(hero);
    } else start();
  })();

  /* ---------- Header state ---------- */
  var header = $("header.top");
  var ticking = false;
  function onScroll() {
    ticking = false;
    if (header) header.classList.toggle("scrolled", scrollY > 12);
    if (!reduce) motion();
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();

/* ---------- Cookie banner ----------
   Google Tag Manager (and with it Google Analytics) loads only after "Accept".
   The choice is stored in this browser as lw-consent = granted | denied. */
(function () {
  var KEY = "lw-consent";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function T(en, bg) { return '<span class="en">' + en + '</span><span class="bg">' + bg + '</span>'; }

  var box = document.createElement("section");
  box.className = "cookie";
  box.setAttribute("aria-label", "Cookies");
  box.innerHTML =
    '<span class="deco" aria-hidden="true"></span>' +
    '<h2><i class="drop-a c-yellow" aria-hidden="true"></i>' + T("Cookies", "Бисквитки") + '</h2>' +
    '<p>' + T("We would like to use Google Analytics cookies to see how visitors use this site, so we can improve it. They are set only if you accept. You can change your choice at any time under \u201cCookie settings\u201d at the bottom of the page.",
              "Бихме искали да използваме бисквитки на Google Analytics, за да виждаме как посетителите използват сайта и да го подобряваме. Те се записват само ако приемете. Можете да промените избора си по всяко време от \u201eНастройки за бисквитки\u201c в долната част на страницата.") + '</p>' +
    '<div class="btns">' +
      '<button type="button" class="btn" data-choice="granted">' + T("Accept", "Приемам") + '</button>' +
      '<button type="button" class="btn out" data-choice="denied">' + T("Decline", "Отказвам") + '</button>' +
    '</div>';
  document.body.appendChild(box);

  function show() { box.classList.add("show"); }
  function hide() { box.classList.remove("show"); }

  box.querySelectorAll("[data-choice]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.choice;
      set(v);
      if (v === "granted") { if (window.lwLoadGTM) window.lwLoadGTM(); }
      else {
        if (window.gtag) gtag("consent", "update", { analytics_storage: "denied" });
        /* remove Google Analytics cookies left from an earlier "Accept" */
        document.cookie.split(";").forEach(function (c) {
          var name = c.split("=")[0].trim();
          if (/^_ga/.test(name)) {
            var host = location.hostname.replace(/^www\./, "");
            ["", "; domain=." + host, "; domain=" + host].forEach(function (d) { document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d; });
          }
        });
      }
      hide();
    });
  });

  /* "Cookie settings" link in the footer reopens the banner */
  var nav = document.querySelector(".foot-nav");
  if (nav) {
    var link = document.createElement("button");
    link.type = "button"; link.className = "cookie-link";
    link.innerHTML = T("Cookie settings", "Настройки за бисквитки");
    link.addEventListener("click", show);
    nav.appendChild(link);
  }

  /* first visit: show after the intro animation on the homepage, quickly elsewhere */
  if (!get()) setTimeout(show, document.querySelector(".curtain") ? 2600 : 700);
})();
