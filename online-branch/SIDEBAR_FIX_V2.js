// SIMPLER FIX - Uses sideonline.json as primary source
// Replace the updateOnlineStatus and createSidebar functions with these:

function updateOnlineStatus() {
    createSidebar(); // Just refresh the whole sidebar
}

function createSidebar() {
    const existing = document.getElementById('discord-online-users-sidebar');
    if (existing) existing.remove();

    const sidebar = document.createElement('div');
    sidebar.id = 'discord-online-users-sidebar';
    sidebar.className = 'discord-sidebar';
    sidebar.style.cssText = 'position:fixed!important;top:60px!important;right:0!important;width:' + sidebarWidth + 'px!important;height:calc(100vh - 60px)!important;background:#2f3136!important;border-left:1px solid #202225!important;z-index:9999!important;overflow-y:auto!important;display:block!important;';
    sidebar.innerHTML = '<div class="discord-sidebar-header" style="padding:16px;border-bottom:1px solid #202225;"><h3 style="color:#8e9297;font-size:12px;font-weight:600;margin:0;">Users — <span class="online-count">0</span></h3></div><div class="discord-sidebar-users loading" style="padding:8px;"></div>';
    document.body.appendChild(sidebar);

    // Fetch online users from sideonline.json - THIS is the source of truth
    ajax("/sideonline.json").then(data => {
        const allUsers = data.users || [];

        console.log('[Discord Chat] Loaded ' + allUsers.length + ' users from sideonline.json');

        onlineUsernames = new Set(allUsers.map(u => u.username));

        const container = document.querySelector('.discord-sidebar-users');
        const count = document.querySelector('.online-count');
        if (!container) return;
        container.classList.remove('loading');

        // Categorize ALL users from sideonline.json
        const admins = [];
        const moderators = [];
        const onlineTL4 = [];
        const onlineTL3 = [];
        const onlineTL2 = [];
        const onlineTL1 = [];
        const onlineTL0 = [];

        allUsers.forEach(user => {
            if (user.admin) {
                admins.push(user);
            } else if (user.moderator) {
                moderators.push(user);
            } else {
                const tl = user.trust_level || 0;
                if (tl === 4) onlineTL4.push(user);
                else if (tl === 3) onlineTL3.push(user);
                else if (tl === 2) onlineTL2.push(user);
                else if (tl === 1) onlineTL1.push(user);
                else onlineTL0.push(user);
            }
        });

        console.log('[Discord Chat] Categorized: Admins=' + admins.length + ', Mods=' + moderators.length + ', TL2=' + onlineTL2.length + ', TL1=' + onlineTL1.length);

        let html = '';

        // Admins
        if (admins.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#e74c3c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Administrators — ' + admins.length + '</div>';
            admins.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Moderators
        if (moderators.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#f39c12;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Moderators — ' + moderators.length + '</div>';
            moderators.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Trust Level 4
        if (onlineTL4.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#9b59b6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 4 — ' + onlineTL4.length + '</div>';
            onlineTL4.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Trust Level 3
        if (onlineTL3.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#1abc9c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 3 — ' + onlineTL3.length + '</div>';
            onlineTL3.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Trust Level 2
        if (onlineTL2.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#95a5a6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 2 — ' + onlineTL2.length + '</div>';
            onlineTL2.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Trust Level 1
        if (onlineTL1.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#7f8c8d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 1 — ' + onlineTL1.length + '</div>';
            onlineTL1.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Trust Level 0
        if (onlineTL0.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#5f6c6d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 0 — ' + onlineTL0.length + '</div>';
            onlineTL0.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        container.innerHTML = html;
        container.querySelectorAll('.discord-user-item').forEach(item => {
            item.onmouseenter = () => item.style.backgroundColor = '#3c3f45';
            item.onmouseleave = () => item.style.backgroundColor = 'transparent';
            item.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showUserCard(item.dataset.username, e); };
        });

        count.textContent = allUsers.length;
    }).catch(err => {
        console.error('[Discord Style Chat] Failed to load users from sideonline.json:', err);
    });
}

function renderUser(user) {
    const avatar = (user.avatar_template.startsWith('/') ? window.location.origin : '') + user.avatar_template.replace('{size}', '96');
    const statusColor = '#43b581'; // All users in sideonline.json are online

    return '<div class="discord-user-item online" data-username="' + user.username + '" style="display:flex;align-items:center;padding:8px;margin:2px 0;border-radius:4px;cursor:pointer;"><div style="width:32px;height:32px;margin-right:12px;position:relative;"><img src="' + avatar + '" style="width:100%;height:100%;border-radius:50%;"><div class="status-dot" style="position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;background:' + statusColor + ';border:3px solid #2f3136;border-radius:50%;"></div></div><div style="flex:1;"><div style="color:#dcddde;font-size:14px;font-weight:500;">' + user.username + '</div></div></div>';
}

// KEY POINTS:
// - This version ONLY uses sideonline.json as the source
// - All users in sideonline.json are considered online (green dot)
// - Console logs added to help debug
// - Simpler logic, no merging needed
