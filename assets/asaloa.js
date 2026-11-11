(function(){
  var live = /(^|\.)asaloa\.de$|\.netlify\.app$/.test(location.hostname);
  function hook(formId, noteId){
    var f = document.getElementById(formId), n = document.getElementById(noteId);
    if(!f || !n) return;
    var thanks = n.textContent;
    f.addEventListener('submit', function(e){
      if(!f.checkValidity()){ return; }
      e.preventDefault();
      if(!live){ n.textContent = 'Vorschau: Abgeschickt wird erst auf asaloa.de.'; n.hidden = false; return; }
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true;
      fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
                  body:new URLSearchParams(new FormData(f)).toString()})
        .then(function(r){ if(!r.ok) throw 0; f.reset(); n.textContent = thanks; n.hidden = false; })
        .catch(function(){ n.textContent = 'Das hat leider nicht geklappt. Schreib uns gern an hallo@asaloa.de.'; n.hidden = false; })
        .finally(function(){ btn.disabled = false; });
    });
  }
  hook('apply-form','apply-note');
  hook('wait-form','wait-note');
  // Schwerpunkt im Formular vorwählen, wenn man über eine Variante kommt
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('[data-variante]') : null;
    if(!a) return;
    var want = a.getAttribute('data-variante');
    document.querySelectorAll('input[name="variante"]').forEach(function(r){ r.checked = (r.value === want); });
  });
})();
