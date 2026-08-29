(function () {
  const paths = {
    shield: '<path d="M12 3 5 6v5c0 4.7 2.9 8.4 7 10 4.1-1.6 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z"/>',
    eye: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    smartphone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 18.5h4"/>',
    message: '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M8.4 14.7A6 6 0 1 1 15.6 14.7C14.6 15.5 14 16.4 14 18h-4c0-1.6-.6-2.5-1.6-3.3Z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    'circle-check': '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    flag: '<path d="M5 21V4m0 1h11l-2 3 2 3H5"/>',
    trash: '<path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14"/><path d="M10 11v6M14 11v6"/>',
    'arrow-left': '<path d="m15 18-6-6 6-6M9 12h11"/>',
    'arrow-right': '<path d="m9 18 6-6-6-6M15 12H4"/>',
    link: '<path d="M10 13a4.5 4.5 0 0 0 6.4.1l2-2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1"/><path d="M14 11a4.5 4.5 0 0 0-6.4-.1l-2 2A4.5 4.5 0 0 0 12 19.3l1.1-1.1"/>',
    landmark: '<path d="M3 9h18L12 3 3 9Z"/><path d="M5 10v7M9 10v7M15 10v7M19 10v7M3 21h18M2 17h20"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.2 9A7 7 0 0 0 6.1 6.1L4 8M5.8 15A7 7 0 0 0 17.9 17.9L20 16"/>',
    phone: '<path d="M7 4 4.5 6.5c-1 1 1.1 5.3 4.2 8.4 3.1 3.1 7.4 5.2 8.4 4.2l2.5-2.5-4-3-2 2c-1.6-.7-3.9-3-4.6-4.6l2-2-3-4Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.5 1A7 7 0 0 0 15 6l-.4-2.7h-4L10 6a7 7 0 0 0-1.4 1L6 6 4 9.5 6 11a7 7 0 0 0 0 2l-2 1.5L6 18l2.6-1a7 7 0 0 0 1.4 1l.5 2.7h4L15 18a7 7 0 0 0 1.4-1l2.6 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
    send: '<path d="m3 4 18 8-18 8 4-8-4-8Z"/><path d="M7 12h14"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7ZM10 20h4"/>',
    'wifi-off': '<path d="M2 8.5A16 16 0 0 1 6.2 6M22 8.5a16 16 0 0 0-9.4-4.4M5 12a11 11 0 0 1 5-2.4M19 12a11 11 0 0 0-3-1.7M8.5 15.5a5 5 0 0 1 7 0M12 20h.01M3 3l18 18"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.3 8.4 4.8 4.8 0 0 0 7 18Z"/>',
    wallet: '<path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12"/><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M15 8l2 2M17 6l2 2"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'list-check': '<path d="m3 6 1.5 1.5L7 5M10 6h11M3 12l1.5 1.5L7 11M10 12h11M3 18l1.5 1.5L7 17M10 18h11"/>',
    badge: '<path d="M12 3 9.8 5.2 6.7 5 6.5 8.1 4.3 10.3 6.5 12.5 6.7 15.6 9.8 15.4 12 17.6l2.2-2.2 3.1.2.2-3.1 2.2-2.2-2.2-2.2-.2-3.1-3.1.2L12 3Z"/><path d="m9.5 10.3 1.5 1.5 3.5-3.5"/>',
    network: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7.3 10.8 16M17 7.3 13.2 16M7 6h10"/>',
    archive: '<rect x="4" y="7" width="16" height="13" rx="1"/><path d="M3 4h18v4H3zM10 12h4"/>',
    'shield-alert': '<path d="M12 3 5 6v5c0 4.7 2.9 8.4 7 10 4.1-1.6 7-5.3 7-10V6l-7-3Z"/><path d="M12 8v5M12 16h.01"/>',
    'qr-code': '<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><path d="M14 14h3v3h-3zM19 14h2M14 19h2M18 18h3v3h-3zM11 4v4M4 11h4"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'shopping-bag': '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2"/>',
    receipt: '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    package: '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    'file-text': '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
    building: '<path d="M4 21V6l8-3 8 3v15M8 9h2M14 9h2M8 13h2M14 13h2M10 21v-4h4v4"/>',
    'credit-card': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
  };

  function icon(name, size = 20, className = '') {
    const body = paths[name] || paths.info;
    return `<svg class="icon-svg ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function hydrate(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {
      const size = Number(el.dataset.iconSize || 20);
      el.innerHTML = icon(el.dataset.icon, size);
    });
  }

  window.AntiScamIcons = { icon, hydrate };
})();
