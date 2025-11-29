// ============================================================================
// REPLACE THE createSidebar() FUNCTION in head_tag.html with this version
// This fixes the issue where not all online users were showing
// ============================================================================

function updateOnlineStatus() {
    ajax("/sideonline.json").then(data => {
        const onlineUsers = data.users || [];
        onlineUsernames = new Set(onlineUsers.map(u => u.username));

        const count = document.querySelector('.online-count');
        if (count) count.textContent = onlineUsernames.size;

        // Refresh the sidebar with updated online status
        createSidebar();
    }).catch(err => {
        console.error('[Discord Style Chat] Failed to fetch online users:', err);
    });
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

    // Fetch BOTH online users AND directory
    Promise.all([
        ajax("/sideonline.json"),
        ajax("/directory_items.json", { data: { period: "all", order: "likes_received", asc: false, limit: 500 } })
    ]).then(([onlineData, directoryData]) => {
        const onlineUsers = onlineData.users || [];
        const directoryUsers = directoryData.directory_items || [];

        // Update online usernames set
        onlineUsernames = new Set(onlineUsers.map(u => u.username));

        const container = document.querySelector('.discord-sidebar-users');
        const count = document.querySelector('.online-count');
        if (!container) return;
        container.classList.remove('loading');

        // Create a map of all users (merge both sources)
        const userMap = new Map();

        // First add all online users from sideonline.json (these are definitely online)
        onlineUsers.forEach(user => {
            userMap.set(user.username, user);
        });

        // Then add/merge directory users (fills in any missing users for admins/mods)
        directoryUsers.forEach(item => {
            const user = item.user;
            if (!userMap.has(user.username)) {
                userMap.set(user.username, user);
            }
        });

        // Categorize users
        const admins = [];
        const moderators = [];
        const onlineTL4 = [];
        const onlineTL3 = [];
        const onlineTL2 = [];
        const onlineTL1 = [];
        const onlineTL0 = [];
        const offline = [];

        userMap.forEach(user => {
            const isOnline = onlineUsernames.has(user.username);

            if (user.admin) {
                admins.push(user); // ALWAYS show admins
            } else if (user.moderator) {
                moderators.push(user); // ALWAYS show moderators
            } else if (isOnline) {
                // Only show non-staff if online
                const tl = user.trust_level || 0;
                if (tl === 4) onlineTL4.push(user);
                else if (tl === 3) onlineTL3.push(user);
                else if (tl === 2) onlineTL2.push(user);
                else if (tl === 1) onlineTL1.push(user);
                else onlineTL0.push(user);
            } else {
                offline.push(user); // Offline non-staff
            }
        });

        let html = '';

        // Admins (always show)
        if (admins.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#e74c3c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Administrators — ' + admins.length + '</div>';
            admins.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Moderators (always show)
        if (moderators.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#f39c12;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Moderators — ' + moderators.length + '</div>';
            moderators.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Online Trust Level 4 (only if online)
        if (onlineTL4.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#9b59b6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 4 — ' + onlineTL4.length + '</div>';
            onlineTL4.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Online Trust Level 3 (only if online)
        if (onlineTL3.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#1abc9c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 3 — ' + onlineTL3.length + '</div>';
            onlineTL3.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Online Trust Level 2 (only if online)
        if (onlineTL2.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#95a5a6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 2 — ' + onlineTL2.length + '</div>';
            onlineTL2.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Online Trust Level 1 (only if online)
        if (onlineTL1.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#7f8c8d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 1 — ' + onlineTL1.length + '</div>';
            onlineTL1.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Online Trust Level 0 (only if online)
        if (onlineTL0.length > 0) {
            html += '<div class="role-group"><div class="role-header" style="color:#5f6c6d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Trust Level 0 — ' + onlineTL0.length + '</div>';
            onlineTL0.forEach(u => html += renderUser(u));
            html += '</div>';
        }

        // Offline (everyone offline except staff) - optional, can be removed if you don't want offline users shown
        if (offline.length > 0 && offline.length < 100) { // Only show offline if less than 100 to avoid clutter
            html += '<div class="role-group"><div class="role-header" style="color:#72767d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:12px 8px 4px 8px;">Offline — ' + offline.length + '</div>';
            offline.slice(0, 50).forEach(u => html += renderUser(u)); // Limit to 50 offline users
            html += '</div>';
        }

        container.innerHTML = html;
        container.querySelectorAll('.discord-user-item').forEach(item => {
            item.onmouseenter = () => item.style.backgroundColor = '#3c3f45';
            item.onmouseleave = () => item.style.backgroundColor = 'transparent';
            item.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showUserCard(item.dataset.username, e); };
        });

        count.textContent = onlineUsernames.size;
    }).catch(err => {
        console.error('[Discord Style Chat] Failed to load users:', err);
    });
}

function renderUser(user) {
    const avatar = (user.avatar_template.startsWith('/') ? window.location.origin : '') + user.avatar_template.replace('{size}', '96');
    const isOnline = onlineUsernames.has(user.username);
    const statusColor = isOnline ? '#43b581' : '#747f8d';
    const onlineClass = isOnline ? ' online' : '';

    return '<div class="discord-user-item' + onlineClass + '" data-username="' + user.username + '" style="display:flex;align-items:center;padding:8px;margin:2px 0;border-radius:4px;cursor:pointer;"><div style="width:32px;height:32px;margin-right:12px;position:relative;"><img src="' + avatar + '" style="width:100%;height:100%;border-radius:50%;"><div class="status-dot" style="position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;background:' + statusColor + ';border:3px solid #2f3136;border-radius:50%;"></div></div><div style="flex:1;"><div style="color:#dcddde;font-size:14px;font-weight:500;">' + user.username + '</div></div></div>';
}

// ============================================================================
// HOW TO INTEGRATE:
// 1. Find the existing updateOnlineStatus() function (around line 89-100)
// 2. Replace it with the version above
// 3. Find the existing createSidebar() function (around line 102-214)
// 4. Replace it with the version above
// 5. Find the existing renderUser() function (around line 216-223)
// 6. Replace it with the version above
// ============================================================================
