const escapeHtml = (unsafe) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return unsafe.replace(/[&<>"']/g, (m) => map[m]);
  };
  
  module.exports = escapeHtml;
  