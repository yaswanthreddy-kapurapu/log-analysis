// Minimal interactivity: mobile nav toggle and sample copy-to-clipboard
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if(btn){
    btn.addEventListener('click', function(){
      if(nav.style.display === 'flex') nav.style.display = 'none'; else nav.style.display = 'flex';
    });
  }

  var downloadBtn = document.getElementById('download-btn');
  // legacy button; kept for compatibility
  if(downloadBtn){
    downloadBtn.addEventListener('click', function(e){
      e.preventDefault();
      alert('Reference build download placeholder — provide your distribution package here.');
    });
  }

  // New: verified download flow: prompts for token and downloads protected artifact
  var downloadRef = document.getElementById('download-ref');
  if(downloadRef){
    downloadRef.addEventListener('click', function(e){
      e.preventDefault();
      var token = prompt('Enter authorization token to download (demo: demo-token):', localStorage.getItem('pla_token') || 'demo-token');
      if(!token) return;
      localStorage.setItem('pla_token', token);
      fetch(downloadRef.getAttribute('href'), {
        headers: { 'Authorization': 'Token ' + token }
      }).then(function(resp){
        if(!resp.ok){ resp.json().then(function(j){ alert('Download failed: ' + (j.error||resp.status)); }); return; }
        return resp.blob();
      }).then(function(blob){
        if(!blob) return;
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = 'reference-build-1.0.0.tar.gz'; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
      }).catch(function(err){ alert('Download error: ' + err.message); });
    });
  }

  var verifyBtn = document.getElementById('verify-ref');
  var manifestText = document.getElementById('manifest-text');
  if(verifyBtn){
    verifyBtn.addEventListener('click', function(e){
      e.preventDefault();
      manifestText.textContent = 'Verifying...';
      fetch('/api/v1/manifest/verify/reference-build-1.0.0').then(function(resp){
        return resp.json();
      }).then(function(json){
        manifestText.textContent = JSON.stringify(json, null, 2);
      }).catch(function(err){ manifestText.textContent = 'Verification error: ' + err.message });
    });
    // auto-load manifest on page load
    fetch('/api/v1/manifest/reference-build-1.0.0').then(function(resp){ return resp.json(); }).then(function(j){ manifestText.textContent = JSON.stringify(j, null, 2); }).catch(function(){ manifestText.textContent = 'Manifest not available' });
  }

  // close mobile nav when a link is clicked and support Escape to close
  if(nav){
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link){
      link.addEventListener('click', function(){
        if(window.innerWidth <= 900){ nav.style.display = 'none'; }
      });
    });
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && nav && window.innerWidth <= 900){
      nav.style.display = 'none';
      if(btn) btn.focus();
    }
  });

  // API playground (local simulation only)
  var runBtn = document.getElementById('run-query');
  var queryInput = document.getElementById('api-query');
  var resultBox = document.getElementById('api-result');
  if(runBtn && queryInput && resultBox){
    runBtn.addEventListener('click', function(){
      var q = queryInput.value || ''; 
      resultBox.textContent = 'Running query...';
      setTimeout(function(){
        // Simulated deterministic response example
        resultBox.textContent = JSON.stringify({ count: 2, results: [ {id: 'evt-1', severity: 'high', message: 'Failed auth attempt'}, {id: 'evt-2', severity: 'high', message: 'Multiple auth fails'} ] }, null, 2);
      }, 600);
    });
  }

  var copyBtn = document.getElementById('copy-endpoint');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      navigator.clipboard && navigator.clipboard.writeText('/api/v1/query').then(function(){
        alert('Endpoint copied to clipboard: /api/v1/query');
      }, function(){ alert('Copy failed'); });
    });
  }
});